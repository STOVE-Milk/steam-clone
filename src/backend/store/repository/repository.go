package repository

import (
	"bytes"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	storeErr "github.com/STOVE-Milk/steam-clone/store/errors"
	"github.com/STOVE-Milk/steam-clone/store/models"
	"github.com/STOVE-Milk/steam-clone/store/utils"
)

// db와의 통신을 관리하고 데이터를 저장하는 패키지입니다.
// db와의 CRUD 역할을 합니다.

type Repo struct {
	db *sql.DB
}

func (r *Repo) GetReviewList(ctx context.Context) ([]*models.Review, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	gameId := ctx.Value("gameId").(int32)

	rows, err := r.db.QueryContext(ctx, `
	SELECT idx, user_id, displayed_name, content, recommendation, created_at, updated_at
	FROM revie
	WHERE game_id=?
	`, gameId)
	if err == sql.ErrNoRows {
		return nil, utils.ErrorHandler(storeErr.EmptyGameDataErr, err)
	}
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetReviewQueryErr, err)
	}
	defer rows.Close()

	var reviewList []*models.Review

	for rows.Next() {
		var review models.Review
		err := rows.Scan(&review.Id, &review.UserId, &review.DisplayedName, &review.Content, &review.Recommendation, &review.CreatedAt, &review.UpdatedAt)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetReviewScanErr, err)
		}
		reviewList = append(reviewList, &review)
	}
	return reviewList, nil
}

func (r *Repo) GetPublisher(ctx context.Context, publisherId int) (*models.Publisher, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	var publisher models.Publisher
	rows, err := r.db.QueryContext(ctx, `
	SELECT idx, name
	FROM publisher
	WHERE idx = ?
	LIMIT 1
	`, publisherId)
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetPublisherQueryErr, err)
	}
	for rows.Next() {
		err := rows.Scan(&publisher.Id, &publisher.Name)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetPublisherScanErr, err)
		}
	}
	return &publisher, nil
}

func (r *Repo) GetGameDetail(ctx context.Context) (*models.GameDetail, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	gameId := ctx.Value("gameId").(int32)
	var gd models.GameDetail
	rows, err := r.db.QueryContext(ctx, `
	SELECT game_id, name, description_snippet, price, sale, image, video, description, publisher_id, review_count, recommend_count, os, language, download_count
	FROM steam.game_category AS gc 
	join steam.game AS g 
	on gc.game_id=g.idx where g.idx = ?
	`, gameId)
	if err == sql.ErrNoRows {
		return nil, utils.ErrorHandler(storeErr.EmptyGameDataErr, err)
	}
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetGameDetailQueryErr, err)
	}
	for rows.Next() {
		err := rows.Scan(&gd.Id, &gd.Name, &gd.DescriptionSnippet, &gd.Price, &gd.Sale, &gd.Image, &gd.Video, &gd.Description, &gd.PublisherId, &gd.ReviewCount, &gd.RecommendCount, &gd.Os, &gd.Language, &gd.DownloadCount)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetGameDetailScanErr, err)
		}
	}
	return &gd, nil
}

// 카카오 프렌즈샵의 통신을 위한 request를 참조하여 제작하였습니다.
// 가장 많이 호출되는 repo 함수로 예상되고 잦은 string 타입의 변화가 있을 것으로 예상 돼 byte buffer를 사용하여 최대한 연산 속도를 높혔습니다.
func (r *Repo) GetSortingGameList(ctx context.Context) ([]*models.GameSimple, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	category_name := ctx.Value("category").(string)
	if category_name == "" {
		category_name = "ALL"
	}
	page := ctx.Value("page").(int32)
	page = page - 1 // 1페이지는 논리 상 0페이지
	if page < 0 {
		page = 0
	}
	size := ctx.Value("size").(int32)
	if size == 0 {
		size = 5
	}
	sort := ctx.Value("sort").(string)
	if sort == "" {
		sort = "idx,desc"
	}
	var gameSimpleList []*models.GameSimple

	var queryBytes bytes.Buffer
	if category_name == "ALL" {
		queryBytes.WriteString("SELECT idx, name, description_snippet, price, sale, image, video, os, download_count FROM game ")
	} else {
		queryBytes.WriteString("SELECT g.idx, g.name, description_snippet, price, sale, image, video, os, download_count ")
		queryBytes.WriteString("FROM steam.game_category AS gc ")
		queryBytes.WriteString("JOIN steam.game AS g ")
		queryBytes.WriteString("ON gc.game_id=g.idx ")
		queryBytes.WriteString("JOIN steam.category AS c ")
		queryBytes.WriteString("ON gc.category_id=c.idx ")
		queryBytes.WriteString("WHERE c.name=? ")
	}
	sortVal := strings.Split(sort, ",")
	if len(sortVal) != 2 {
		err := errors.New("GetSortingGameList sort 입력 방식 틀림")
		return nil, utils.ErrorHandler(storeErr.GetSotingGameListQueryErr, err)
	}

	queryBytes.WriteString("ORDER BY ")
	queryBytes.WriteString(sortVal[0])
	queryBytes.WriteString(" ")
	queryBytes.WriteString(sortVal[1])
	queryBytes.WriteString(" LIMIT ?,?")
	var rows *sql.Rows
	var err error
	if category_name == "ALL" {
		rows, err = r.db.QueryContext(ctx, queryBytes.String(), page*size, size)
	} else {
		rows, err = r.db.QueryContext(ctx, queryBytes.String(), category_name, page*size, size)
	}
	if err == sql.ErrNoRows {
		return nil, utils.ErrorHandler(storeErr.EmptyGameDataErr, err)
	}
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetSotingGameListQueryErr, err)
	}
	defer rows.Close()
	for rows.Next() {
		var game models.GameSimple
		err := rows.Scan(&game.Id, &game.Name, &game.DescriptionSnippet, &game.Price, &game.Sale, &game.Image, &game.Video, &game.Os, &game.DownloadCount)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetSotingGameListScanErr, err)
		}
		gameSimpleList = append(gameSimpleList, &game)
	}
	return gameSimpleList, nil
}

// category table의 모든 값들을 가져옴.
func (r *Repo) GetAllCategoryList(ctx context.Context) ([]*models.Category, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	var categoryList []*models.Category
	rows, err := r.db.QueryContext(ctx, "SELECT idx, parent_id, name FROM category")
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetCategoryListQueryErr, err)
	}
	defer rows.Close()
	for rows.Next() {
		var category models.Category
		err := rows.Scan(&category.Id, &category.ParentIdx, &category.Name)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetCategoryListScanErr, err)
		}
		categoryList = append(categoryList, &category)
	}
	return categoryList, nil
}

func (r *Repo) GetCategoryListByGameId(ctx context.Context) ([]*models.Category, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	gameId := ctx.Value("gameId").(int32)
	var categoryList []*models.Category
	rows, err := r.db.QueryContext(ctx, `
	SELECT name 
	FROM game_category AS gc
	JOIN category AS c
	on gc.category_id=c.idx
	WHERE gc.game_id=?
	`, gameId)
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetCategoryListByGameIdQueryErr, err)
	}
	defer rows.Close()
	for rows.Next() {
		var category models.Category
		err := rows.Scan(&category.Name)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetCategoryListByGameIdScanErr, err)
		}
		categoryList = append(categoryList, &category)
	}
	return categoryList, nil
}

func (r *Repo) GetGameListByUserId(ctx context.Context) ([]*models.GameSimple, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId")
	var gameSimpleList []*models.GameSimple
	rows, err := r.db.QueryContext(ctx, `	
	SELECT g.idx, g.name, g.description_snippet, g.price, g.sale, g.image, g.video, g.os, g.download_count
	FROM library AS l
	JOIN game AS g
	ON l.game_id=g.idx
	WHERE l.user_id=?
	`, userId)
	if err == sql.ErrNoRows {
		return nil, utils.ErrorHandler(storeErr.EmptyGameDataErr, err)
	}
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetGameListInWishlistQueryErr, err)
	}
	defer rows.Close()
	for rows.Next() {
		var game models.GameSimple
		err := rows.Scan(&game.Id, &game.Name, &game.DescriptionSnippet, &game.Price, &game.Sale, &game.Image, &game.Video, &game.Os, &game.DownloadCount)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetGameListInWishlistScanErr, err)
		}
		gameSimpleList = append(gameSimpleList, &game)
	}
	return gameSimpleList, nil
}

func (r *Repo) GetGameListInWishlist(ctx context.Context) ([]*models.GameSimple, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId")
	var gameSimpleList []*models.GameSimple
	rows, err := r.db.QueryContext(ctx, `	
	SELECT g.idx, g.name, g.description_snippet, g.price, g.sale, g.image, g.video, g.os, g.download_count
	FROM wishlist AS w
	JOIN game AS g
	ON w.game_id=g.idx
	WHERE w.user_id=?
	`, userId)
	if err == sql.ErrNoRows {
		return nil, utils.ErrorHandler(storeErr.EmptyGameDataErr, err)
	}
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetGameListInWishlistQueryErr, err)
	}
	defer rows.Close()
	for rows.Next() {
		var game models.GameSimple
		err := rows.Scan(&game.Id, &game.Name, &game.DescriptionSnippet, &game.Price, &game.Sale, &game.Image, &game.Video, &game.Os, &game.DownloadCount)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetGameListInWishlistScanErr, err)
		}
		gameSimpleList = append(gameSimpleList, &game)
	}
	return gameSimpleList, nil
}

func (r *Repo) GetGameListInCart(ctx context.Context) ([]*models.GameSimple, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	gameIdList := ctx.Value("gameIdList").(string)
	if gameIdList == "" {
		return nil, utils.ErrorHandler(storeErr.EmptyCartErr, errors.New("ID값 전달 안됨."))
	}
	var gameSimpleList []*models.GameSimple
	rows, err := r.db.QueryContext(ctx, fmt.Sprintf("SELECT idx, name, description_snippet, price, sale, image, video, os, download_count FROM game WHERE idx In (%v)", gameIdList))
	if err == sql.ErrNoRows {
		return nil, utils.ErrorHandler(storeErr.EmptyGameDataErr, err)
	}
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetGameListInCartQueryErr, err)
	}
	defer rows.Close()
	for rows.Next() {
		var game models.GameSimple
		err := rows.Scan(&game.Id, &game.Name, &game.DescriptionSnippet, &game.Price, &game.Sale, &game.Image, &game.Video, &game.Os, &game.DownloadCount)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetGameListInCartScanErr, err)
		}
		gameSimpleList = append(gameSimpleList, &game)
	}
	return gameSimpleList, nil
}

func (r *Repo) GetPurchaseList(ctx context.Context) ([]int32, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	var purchaseList []int32
	rows, err := r.db.QueryContext(ctx, `	
	SELECT game_id
	FROM library
	WHERE user_id=?
	`, userId)
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetPurchaseGameListQueryErr, err)
	}
	defer rows.Close()
	for rows.Next() {
		var gameId int32
		err := rows.Scan(&gameId)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetPurchaseGameListScanErr, err)
		}
		purchaseList = append(purchaseList, gameId)
	}
	return purchaseList, nil
}

func (r *Repo) PostReview(ctx context.Context) (bool, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	gameId := ctx.Value("gameId").(int32)
	displayedName := ctx.Value("nickname").(string)
	reviewContent := ctx.Value("reviewContent").(string)
	reviewRecommendation := ctx.Value("reviewRecommendation").(int32)

	_, err := r.db.Exec("INSERT INTO review(user_id, game_id, displayed_name, content, recommendation) VALUES(?,?,?,?,?)", userId, gameId, displayedName, reviewContent, reviewRecommendation)
	if err != nil {
		return false, utils.ErrorHandler(storeErr.PostReviewQueryErr, err)
	}
	return true, nil
}

func (r *Repo) PatchReview(ctx context.Context) (bool, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	reviewId := ctx.Value("reviewId").(int32)
	reviewContent := ctx.Value("reviewContent").(string)
	reviewRecommendation := ctx.Value("reviewRecommendation").(int32)
	_, err := r.db.Exec("UPDATE review SET content=?, recommendation=? WHERE idx=? AND user_id=?", reviewContent, reviewRecommendation, reviewId, userId)
	if err != nil {
		return false, utils.ErrorHandler(storeErr.PatchReviewQueryErr, err)
	}
	return true, nil
}

func (r *Repo) DeleteReview(ctx context.Context) (bool, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	reviewId := ctx.Value("reviewId").(int32)
	_, err := r.db.Exec("DELETE FROM review WHERE idx=? AND user_id=?", reviewId, userId)
	if err != nil {
		return false, utils.ErrorHandler(storeErr.DeleteReviewQueryErr, err)
	}
	return true, nil
}

func (r *Repo) DeleteWishlist(ctx context.Context) (bool, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	gameId := ctx.Value("gameId").(int32)
	_, err := r.db.Exec("DELETE FROM wishlist WHERE user_id=? AND game_id=?", userId, gameId)
	if err != nil {
		return false, utils.ErrorHandler(storeErr.DeleteWishListQueryErr, err)
	}
	return true, nil
}

func (r *Repo) GetWishlist(ctx context.Context) ([]int32, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	var wishlist []int32
	rows, err := r.db.QueryContext(ctx, `	
	SELECT game_id
	FROM wishlist
	WHERE user_id=?
	`, userId)
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetWishListQueryErr, err)
	}
	defer rows.Close()
	for rows.Next() {
		var gameId int32
		err := rows.Scan(&gameId)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetWishListScanErr, err)
		}
		wishlist = append(wishlist, gameId)
	}
	return wishlist, nil
}

func (r *Repo) PostWishlist(ctx context.Context) (bool, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	gameId := ctx.Value("gameId").(int32)
	_, err := r.db.Exec("INSERT INTO wishlist(user_id, game_id) VALUES(?,?)", userId, gameId)
	if err != nil {
		return false, utils.ErrorHandler(storeErr.PostWishListQueryErr, err)
	}

	return true, nil
}

func (r *Repo) GetSearchingGameList(ctx context.Context) ([]*models.GameSimple, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	content := ctx.Value("content").(string)
	var gameSimpleList []*models.GameSimple
	rows, err := r.db.QueryContext(ctx, `	
	SELECT idx, name, description_snippet, price, sale, image, video, os, download_count 
	FROM steam.game
	WHERE name like ?
	`, "%"+content+"%")
	if err != nil {
		return nil, utils.ErrorHandler(storeErr.GetSearchingGameListQueryErr, err)
	}
	defer rows.Close()
	for rows.Next() {
		var game models.GameSimple
		err := rows.Scan(&game.Id, &game.Name, &game.DescriptionSnippet, &game.Price, &game.Sale, &game.Image, &game.Video, &game.Os, &game.DownloadCount)
		if err != nil {
			return nil, utils.ErrorHandler(storeErr.GetSearchingGameListScanErr, err)
		}
		gameSimpleList = append(gameSimpleList, &game)
	}
	return gameSimpleList, nil
}

func (r *Repo) GameInstall(ctx context.Context) (bool, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	gameId := ctx.Value("gameId").(int32)
	n, err := r.db.Exec("UPDATE library SET is_installed=1 WHERE user_id=? AND game_id=?", userId, gameId)
	if err != nil {
		return false, utils.ErrorHandler(storeErr.GameInstallQueryErr, err)
	}
	if ok, _ := n.RowsAffected(); ok == 0 {
		return false, utils.ErrorHandler(storeErr.AlreadyGameInstallErr, err)
	}

	return true, nil
}

func (r *Repo) GameUninstall(ctx context.Context) (bool, *models.Error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	gameId := ctx.Value("gameId").(int32)
	n, err := r.db.Exec("UPDATE library SET is_installed=0 WHERE user_id=? AND game_id=?", userId, gameId)
	if err != nil {
		return false, utils.ErrorHandler(storeErr.GameUninstallQueryErr, err)
	}
	if ok, _ := n.RowsAffected(); ok == 0 {
		return false, utils.ErrorHandler(storeErr.AlreadyGameUninstallErr, err)
	}
	return true, nil
}

func NewGameRepo(db *sql.DB) *Repo {
	return &Repo{
		db: db,
	}
}
