package controller

import (
	"context"
	"database/sql"

	pb "github.com/STOVE-Milk/steam-clone/store/proto"

	"github.com/STOVE-Milk/steam-clone/store/repository"
)

type GameController struct {
	gr *repository.GameRepository
}

func NewGameCtr(db *sql.DB) *GameController {
	return &GameController{
		gr: repository.NewGameGr(db),
	}
}

func (gc *GameController) GetParentCategoryList(ctx context.Context) (*pb.CategoryListResponse_CategoryList, error) {
	parentCategoryList, err := gc.gr.GetCategoryList(ctx)
	if err != nil {
		return nil, err
	}

	var pbCategoryList pb.CategoryListResponse_CategoryList

	for _, category := range parentCategoryList {
		if category.Idx == category.ParentIdx {
			pbCategoryList.CategoryList = append(pbCategoryList.CategoryList, category.Name)
		}
	}
	return &pbCategoryList, nil
}

func (gc *GameController) GetGameListByCategory(ctx context.Context, category string) (*pb.GameSimpleListResponse_GameSimpleList, error) {
	gameSimpleList, err := gc.gr.GetGameListByCategory(ctx, category)
	if err != nil {
		return nil, err
	}
	var pbGameSimpleList *pb.GameSimpleListResponse_GameSimpleList
	pbGameSimpleList.GameSimpleList = make([]*pb.GameSimple, len(gameSimpleList))
	for i, game := range gameSimpleList {
		var imageSub []string
		var videoSub []string
		for _, image := range game.Image["sub"].([]interface{}) {
			imageSub = append(imageSub, image.(string))
		}
		for _, video := range game.Video["sub"].([]interface{}) {
			videoSub = append(videoSub, video.(string))
		}
		pbGameSimpleList.GameSimpleList[i] = &pb.GameSimple{
			GameId:             int32(game.Id),
			Name:               game.Name,
			DescriptionSnippet: game.DescriptionSnippet,
			Price:              int32(game.Price),
			Sale:               int32(game.Sale),
			Image: &pb.ContentsPath{
				Main: game.Image["main"].(string),
				Sub:  imageSub,
			},
			Video: &pb.ContentsPath{
				Main: game.Video["main"].(string),
				Sub:  videoSub,
			},
		}
	}

	return pbGameSimpleList, nil
}

func (gc *GameController) GetGameDetail(ctx context.Context, gameId int32) (*pb.GameDetail, error) {
	gameDetail, _ := gc.gr.GetGameDetail(ctx, gameId)
	var imageSub []string
	var videoSub []string
	for _, image := range gameDetail.Image["sub"].([]interface{}) {
		imageSub = append(imageSub, image.(string))
	}
	for _, video := range gameDetail.Video["sub"].([]interface{}) {
		videoSub = append(videoSub, video.(string))
	}
	return &pb.GameDetail{

		GameId:             int32(gameDetail.Id),
		Name:               gameDetail.Name,
		DescriptionSnippet: gameDetail.Description,
		Price:              int32(gameDetail.Price),
		Sale:               int32(gameDetail.Sale),
		Image: &pb.ContentsPath{
			Main: gameDetail.Image["main"].(string),
			Sub:  imageSub,
		},
		Video: &pb.ContentsPath{
			Main: gameDetail.Video["main"].(string),
			Sub:  videoSub,
		},
		//+카테고리 + os
		Description: gameDetail.Description,
		Publisher: &pb.Publisher{
			Id:   gameDetail.Publisher["id"].(int32),
			Name: gameDetail.Publisher["name"].(string),
		},
		ReviewCount:    gameDetail.ReviewCount,
		RecommendCount: gameDetail.RecommendCount,
		//+언어
	}, nil
}

// func (gc *GameController) GetDiscountingGameList(ctx context.Context) ([]*pb.GameSimple, error) {

// }

// func (gc *GameController) GetReviewList(ctx context.Context, gameId int32) ([]*pb.Review, error) {

// }
