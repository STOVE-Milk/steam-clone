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
			GameIdx:            int32(game.Id),
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


func (gc *GameController) GetGameDetail(ctx context.Context, gameId int32) (*pb., error) {
