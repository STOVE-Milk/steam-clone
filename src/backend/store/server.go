package main

import (
	"context"
	"log"
	"net"

	"github.com/STOVE-Milk/steam-clone/store/config"
	"github.com/STOVE-Milk/steam-clone/store/controller"
	pb "github.com/STOVE-Milk/steam-clone/store/proto"
	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc"
)

const portNumber = "8101"

type storeServer struct {
	pb.StoreServer
	gameCtr *controller.GameController
}

func Server() *storeServer {
	return &storeServer{}
}

func (store *storeServer) Run(ctx context.Context) error {
	db := config.InitDB()
	defer db.Close()

	lis, err := net.Listen("tcp", ":"+portNumber)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	storeServer := &storeServer{}
	storeServer.gameCtr = controller.NewGameCtr(db)

	pb.RegisterStoreServer(grpcServer, storeServer)

	log.Printf("start gRPC server on %s port", portNumber)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
	return nil
}

// GetUser returns user message by user_id
func (store *storeServer) GetCategoryList(ctx context.Context, _ *empty.Empty) (*pb.CategoryListResponse, error) {
	res, err := store.gameCtr.GetParentCategoryList(ctx)
	if err != nil {
		return &pb.CategoryListResponse{
			Code:    21000,
			Message: "can not get category list Err : " + err.Error(),
		}, nil
	}
	return &pb.CategoryListResponse{
		Code:    21000,
		Message: "category list",
		Data:    res,
	}, nil

}

func (store *storeServer) GetSortingGameList(ctx context.Context, req *pb.SortingParamRequest) (*pb.GameSimpleListResponse, error) {
	category := req.Category
	page := req.Page
	size := req.Size
	sort := req.Sort
	res, err := store.gameCtr.GetSortingGameList(ctx, category, page, size, sort)
	if err != nil {
		return &pb.GameSimpleListResponse{
			Code:    21000,
			Message: "can not get game list Error : " + err.Error(),
		}, nil
	}
	return &pb.GameSimpleListResponse{
		Code:    21000,
		Message: "game list by category",
		Data:    res,
	}, nil
}

func (store *storeServer) GetGame(ctx context.Context, req *pb.GameIdQueryParamRequest) (*pb.GameDetailResponse, error) {
	gameId := req.GameId
	res, err := store.gameCtr.GetGameDetail(ctx, gameId)
	if err != nil {
		return &pb.GameDetailResponse{
			Code:    21000,
			Message: "can not get the game Error : " + err.Error(),
		}, nil
	}
	return &pb.GameDetailResponse{
		Code:    21000,
		Message: "game",
		Data:    res,
	}, nil
}

func (store *storeServer) GetReviewList(ctx context.Context, req *pb.GameIdQueryParamRequest) (*pb.ReviewListResponse, error) {
	gameId := req.GameId
	res, err := store.gameCtr.GetReviewList(ctx, gameId)
	if err != nil {
		return &pb.ReviewListResponse{
			Code:    21000,
			Message: "can not get the game review list : " + err.Error(),
		}, nil
	}
	return &pb.ReviewListResponse{
		Code:    21000,
		Message: "review list",
		Data:    res,
	}, nil
}

func (store *storeServer) GetWishlist(ctx context.Context, _ *empty.Empty) (*pb.WishlistResponse, error) {
	userId := 1
	res, err := store.gameCtr.GetWishlist(ctx, int32(userId))
	if err != nil {
		return &pb.WishlistResponse{
			Code:    21000,
			Message: "can not get wishlist : " + err.Error(),
		}, nil
	}
	return &pb.WishlistResponse{
		Code:    21000,
		Message: "wishlist",
		Data:    res,
	}, nil
}

func (store *storeServer) GetGameListInWishlist(ctx context.Context, _ *empty.Empty) (*pb.GameSimpleListResponse, error) {
	userId := 1
	res, err := store.gameCtr.GetGameListInWishlist(ctx, int32(userId))
	if err != nil {
		return &pb.GameSimpleListResponse{
			Code:    21000,
			Message: "can not get game list Error : " + err.Error(),
		}, nil
	}
	return &pb.GameSimpleListResponse{
		Code:    21000,
		Message: "game list by category",
		Data:    res,
	}, nil
}
