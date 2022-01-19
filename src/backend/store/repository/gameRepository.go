package repository

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/STOVE-Milk/steam-clone/store/model"
)

type GameRepository struct {
	db *sql.DB
}

func (gr *GameRepository) GetReviewList(ctx context.Context, gameId int32) ([]*model.Review, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	rows, err := gr.db.QueryContext(ctx, `
	SELECT idx, user_id, displayed_name, content, recommendation
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
		err := rows.Scan(&review.Id, &review.UserId, &review.DisplayedName, &review.Content, &review.Recommendation)
		if err != nil {
			fmt.Println(err.Error())
		}
		reviewList = append(reviewList, &review)
	}
	return reviewList, nil
}
func (gr *GameRepository) GetGameDetail(ctx context.Context, gameId int32) (*model.GameDetail, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	var gd *model.GameDetail
	rows, err := gr.db.QueryContext(ctx, `
	SELECT game_id, name, description_snippet, price, sale, image, video, description, publisher, review_count, recommend_count, language
	FROM steam.game_category AS gc 
	join steam.game AS g 
	on gc.game_id=g.idx where g.idx = ?
	`, gameId)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		fmt.Println(rows)
		rows.Scan(&gd.Id, &gd.Name, &gd.DescriptionSnippet, &gd.Price, &gd.Sale, &gd.Image, &gd.Video, &gd.Description, &gd.Publisher, &gd.ReviewCount, &gd.RecommendCount, &gd.Language)

	}
	return gd, nil
}

func (gr *GameRepository) GetGameListByCategory(ctx context.Context, category string) ([]*model.GameSimple, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	var gameSimpleList []*model.GameSimple
	rows, err := gr.db.QueryContext(ctx, `	
	SELECT game_id, name, description_snippet, price, sale, image, video
	FROM steam.game_category AS gc 
	join steam.game AS g 
	on gc.game_id=g.idx where gc.category_name=?
	LIMIT 5
	`, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var game model.GameSimple
		err := rows.Scan(&game.Id, &game.Name, &game.DescriptionSnippet, &game.Price, &game.Sale, &game.Image, &game.Video)
		if err != nil {
			log.Fatal(err)
		}
		gameSimpleList = append(gameSimpleList, &game)
	}
	return gameSimpleList, nil
}

func (gr *GameRepository) GetDiscountingGameList(ctx context.Context) ([]*model.GameSimple, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	var gameSimpleList []*model.GameSimple
	rows, err := gr.db.QueryContext(ctx, `	
	SELECT game_id, name, description_snippet, price, sale, image, video
	FROM steam.game_category AS gc 
	join steam.game AS g 
	on gc.game_id=g.idx 
	ORDER BY sale DESC
	LIMIT 5
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var game model.GameSimple
		err := rows.Scan(&game.Id, &game.Name, &game.DescriptionSnippet, &game.Price, &game.Sale, &game.Image, &game.Video)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(game)
		gameSimpleList = append(gameSimpleList, &game)
	}
	return gameSimpleList, nil
}

// category table의 모든 값들을 가져옴.
func (gr *GameRepository) GetCategoryList(ctx context.Context) ([]*model.Category, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	var categoryList []*model.Category
	rows, err := gr.db.QueryContext(ctx, "SELECT idx, parent_id, name FROM category")
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

func NewGameGr(db *sql.DB) *GameRepository {
	return &GameRepository{
		db: db,
	}
}
