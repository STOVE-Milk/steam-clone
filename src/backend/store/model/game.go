package model

import (
	pb "github.com/STOVE-Milk/steam-clone/store/proto"
)

type GameRepository interface {
	GetCategoryList() []string
	GetGameListByCategory(category string) []*pb.GameSimple
	GetGame(gameId int) *pb.GameDetail
	// GetReviewList()
	// GetGameListInWishlist()
	// GetDiscountingGameList()
}

type GameDetail pb.GameDetail
type GameSimple pb.GameSimple
