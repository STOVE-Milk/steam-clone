package repository

import (
	"bytes"
	"context"
	"database/sql"
	"errors"
	"log"
	"strings"
	"time"

	"github.com/STOVE-Milk/steam-clone/store/model"
)

type Repo struct {
	db *sql.DB
}

func (r *Repo) GetReviewList(ctx context.Context) ([]*model.Review, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	gameId := ctx.Value("gameId").(int32)
	rows, err := r.db.QueryContext(ctx, `
	SELECT idx, user_id, displayed_name, content, recommendation, created_at, updated_at
	FROM review
	WHERE game_id=?
	`, gameId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviewList []*model.Review

	for rows.Next() {
		var review model.Review
		err := rows.Scan(&review.Id, &review.UserId, &review.DisplayedName, &review.Content, &review.Recommendation, &review.CreatedAt, &review.UpdatedAt)
		if err != nil {
			return nil, err
		}
		reviewList = append(reviewList, &review)
	}
	return reviewList, nil
}

func (r *Repo) GetPublisher(ctx context.Context, publisherId int) (*model.Publisher, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	var publisher model.Publisher
	rows, err := r.db.QueryContext(ctx, `
	SELECT idx, name
	FROM publisher
	WHERE idx = ?
	LIMIT 1
	`, publisherId)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		rows.Scan(&publisher.Id, &publisher.Name)
	}
	return &publisher, nil
}

func (r *Repo) GetGameDetail(ctx context.Context) (*model.GameDetail, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	gameId := ctx.Value("gameId").(int32)
	var gd model.GameDetail
	rows, err := r.db.QueryContext(ctx, `
	SELECT game_id, name, description_snippet, price, sale, image, video, description, publisher_id, review_count, recommend_count, os, language, download_count
	FROM steam.game_category AS gc 
	join steam.game AS g 
	on gc.game_id=g.idx where g.idx = ?
	`, gameId)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		rows.Scan(&gd.Id, &gd.Name, &gd.DescriptionSnippet, &gd.Price, &gd.Sale, &gd.Image, &gd.Video, &gd.Description, &gd.PublisherId, &gd.ReviewCount, &gd.RecommendCount, &gd.Os, &gd.Language, &gd.DownloadCount)
	}
	return &gd, nil
}

func (r *Repo) GetSortingGameList(ctx context.Context) ([]*model.GameSimple, error) {
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
	var gameSimpleList []*model.GameSimple

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
		return nil, errors.New("sort 쿼리가 잘못 입력 됐습니다.")
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
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var game model.GameSimple
		err := rows.Scan(&game.Id, &game.Name, &game.DescriptionSnippet, &game.Price, &game.Sale, &game.Image, &game.Video, &game.Os, &game.DownloadCount)
		if err != nil {
			return nil, err
		}
		gameSimpleList = append(gameSimpleList, &game)
	}
	return gameSimpleList, nil
}

// category table의 모든 값들을 가져옴.
func (r *Repo) GetAllCategoryList(ctx context.Context) ([]*model.Category, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	var categoryList []*model.Category
	rows, err := r.db.QueryContext(ctx, "SELECT idx, parent_id, name FROM category")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var category model.Category
		rows.Scan(&category.Id, &category.ParentIdx, &category.Name)
		categoryList = append(categoryList, &category)
	}
	return categoryList, nil
}

func (r *Repo) GetCategoryListByGameId(ctx context.Context) ([]*model.Category, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	gameId := ctx.Value("gameId").(int32)
	var categoryList []*model.Category
	rows, err := r.db.QueryContext(ctx, `
	SELECT name 
	FROM game_category AS gc
	JOIN category AS c
	on gc.category_id=c.idx
	WHERE gc.game_id=?
	`, gameId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var category model.Category
		rows.Scan(&category.Name)
		categoryList = append(categoryList, &category)
	}
	return categoryList, nil
}

func (r *Repo) GetGameListInWishlist(ctx context.Context) ([]*model.GameSimple, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId")
	var gameSimpleList []*model.GameSimple
	rows, err := r.db.QueryContext(ctx, `	
	SELECT g.idx, g.name, g.description_snippet, g.price, g.sale, g.image, g.video, g.os, g.download_count
	FROM wishlist AS w
	JOIN game AS g
	ON w.game_id=g.idx
	WHERE w.user_id=?
	`, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var game model.GameSimple
		err := rows.Scan(&game.Id, &game.Name, &game.DescriptionSnippet, &game.Price, &game.Sale, &game.Image, &game.Video, &game.Os, &game.DownloadCount)
		if err != nil {
			log.Fatal(err)
		}
		gameSimpleList = append(gameSimpleList, &game)
	}
	return gameSimpleList, nil
}

func (r *Repo) PostWishlist(ctx context.Context) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	gameId := ctx.Value("gameId").(int32)
	res, err := r.db.Exec("INSERT INTO wishlist(user_id, game_id) VALUES(?,?)", userId, gameId)
	if err != nil {
		return false, err
	}
	if n, _ := res.RowsAffected(); n != 1 {
		return false, errors.New("값 변경 없음")
	}
	return true, nil
}

func (r *Repo) DeleteWishlist(ctx context.Context) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	gameId := ctx.Value("gameId").(int32)
	_, err := r.db.Exec("DELETE FROM wishlist WHERE user_id=? AND game_id=?", userId, gameId)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (r *Repo) GetWishlist(ctx context.Context) ([]int32, error) {
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
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var gameId int32
		err := rows.Scan(&gameId)
		if err != nil {
			return nil, err
		}
		wishlist = append(wishlist, gameId)
	}
	return wishlist, nil
}

func (r *Repo) GetPurchaseList(ctx context.Context) ([]int32, error) {
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
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var gameId int32
		err := rows.Scan(&gameId)
		if err != nil {
			return nil, err
		}
		purchaseList = append(purchaseList, gameId)
	}
	return purchaseList, nil
}

func (r *Repo) PostReview(ctx context.Context) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	gameId := ctx.Value("gameId").(int32)
	displayedName := ctx.Value("nickname").(string)
	reviewContent := ctx.Value("reviewContent").(string)
	reviewRecommendation := ctx.Value("reviewRecommendation").(int32)

	_, err := r.db.Exec("INSERT INTO review(user_id, game_id, displayed_name, content, recommendation) VALUES(?,?,?,?,?)", userId, gameId, displayedName, reviewContent, reviewRecommendation)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (r *Repo) PatchReview(ctx context.Context) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	reviewId := ctx.Value("reviewId").(int32)
	reviewContent := ctx.Value("reviewContent").(string)
	reviewRecommendation := ctx.Value("reviewRecommendation").(int32)
	_, err := r.db.Exec("UPDATE review SET content=?, recommendation=? WHERE idx=? AND user_id=?", reviewContent, reviewRecommendation, reviewId, userId)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (r *Repo) DeleteReview(ctx context.Context) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	userId := ctx.Value("userId").(int32)
	reviewId := ctx.Value("reviewId").(int32)
	_, err := r.db.Exec("DELETE FROM review WHERE idx=? AND user_id=?", reviewId, userId)
	if err != nil {
		return false, err
	}
	return true, nil
}

func NewGameRepo(db *sql.DB) *Repo {
	return &Repo{
		db: db,
	}
}
