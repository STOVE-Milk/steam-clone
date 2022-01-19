package model

import (
	pb "github.com/STOVE-Milk/steam-clone/store/proto"
)

type GameRepository interface {
	GetCategoryList() []string
	GetGameListByCategory(category string) []*pb.GameSimple
	GetGameDetail(gameId int) *pb.GameDetail
	// GetReviewList()
	// GetGameListInWishlist()
	// GetDiscountingGameList()
}

type StringJsonMap map[string]interface{}

type GameDetail struct {
	GameSimple
	Description    string
	Publisher      StringJsonMap
	ReviewCount    int32
	RecommendCount int32
	Language       []string
}

type GameSimple struct {
	Id                 int           `json:"game_id"`
	Name               string        `json:"name"`
	DescriptionSnippet string        `json:"description_snippet"`
	Price              int           `json:"price"`
	Sale               int           `json:"sale"`
	Image              StringJsonMap `json:"image"`
	Video              StringJsonMap `json:"video"`
	// Os                 []interface{}          `json:"os"`
}

type Category struct {
	Idx       int    `json:"idx"`
	ParentIdx int    `json:"parent_id"`
	Name      string `json:"name"`
}
