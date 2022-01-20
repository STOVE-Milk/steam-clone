package repository

import (
	"bytes"
	"context"
	"database/sql"
	"log"
	"strings"
	"time"

	"github.com/STOVE-Milk/steam-clone/store/model"
)

type Repo struct {
	db *sql.DB
}

func (r *Repo) GetReviewList(ctx context.Context, gameId int32) ([]*model.Review, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	rows, err := r.db.QueryContext(ctx, `
	SELECT idx, user_id, displayed_name, content, recommendation, created_at
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
		err := rows.Scan(&review.Id, &review.UserId, &review.DisplayedName, &review.Content, &review.Recommendation, &review.CreatedAt)
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

func (r *Repo) GetGameDetail(ctx context.Context, gameId int32) (*model.GameDetail, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	var gd model.GameDetail
	rows, err := r.db.QueryContext(ctx, `
	SELECT game_id, name, description_snippet, price, sale, image, video, description, publisher_id, review_count, recommend_count, os, language
	FROM steam.game_category AS gc 
	join steam.game AS g 
	on gc.game_id=g.idx where g.idx = ?
	`, gameId)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		rows.Scan(&gd.Id, &gd.Name, &gd.DescriptionSnippet, &gd.Price, &gd.Sale, &gd.Image, &gd.Video, &gd.Description, &gd.PublisherId, &gd.ReviewCount, &gd.RecommendCount, &gd.Os, &gd.Language)
	}
	return &gd, nil
}

func (r *Repo) GetSortingGameList(ctx context.Context, category_name string, page, size int32, sort string) ([]*model.GameSimple, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	var gameSimpleList []*model.GameSimple

	var queryBytes bytes.Buffer
	if category_name == "모두" {
		queryBytes.WriteString("SELECT idx, name, description_snippet, price, sale, image, video, os FROM game ")
	} else {
		queryBytes.WriteString("SELECT g.idx, g.name, description_snippet, price, sale, image, video, os ")
		queryBytes.WriteString("FROM steam.game_category AS gc ")
		queryBytes.WriteString("JOIN steam.game AS g ")
		queryBytes.WriteString("ON gc.game_id=g.idx ")
		queryBytes.WriteString("JOIN steam.category AS c ")
		queryBytes.WriteString("ON gc.category_id=c.idx ")
		queryBytes.WriteString("WHERE c.name=? ")
	}
	sortVal := strings.Split(sort, ",")
	queryBytes.WriteString("ORDER BY ")
	queryBytes.WriteString(sortVal[0])
	queryBytes.WriteString(" ")
	queryBytes.WriteString(sortVal[1])
	queryBytes.WriteString(" LIMIT ?,?")
	var rows *sql.Rows
	var err error
	if category_name == "모두" {
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
		err := rows.Scan(&game.Id, &game.Name, &game.DescriptionSnippet, &game.Price, &game.Sale, &game.Image, &game.Video, &game.Os)
		if err != nil {
			log.Fatal(err)
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

func (r *Repo) GetCategoryListByGameId(ctx context.Context, gameId int) ([]*model.Category, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
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

func (r *Repo) GetWishlist(ctx context.Context, userId int32) ([]int32, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
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

func NewGameRepo(db *sql.DB) *Repo {
	return &Repo{
		db: db,
	}
}
