package main

import (
	"context"
	"log"
	"net"

	"github.com/STOVE-Milk/steam-clone/store/config"
	"github.com/STOVE-Milk/steam-clone/store/controller"
	"github.com/STOVE-Milk/steam-clone/store/model"
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

func (store *storeServer) Run() error {
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
			Code:    31010,
			Message: "부모 카테고리 불러오기 에러 " + err.Error(),
		}, nil
	}
	return &pb.CategoryListResponse{
		Code:    31000,
		Message: "category list",
		Data:    res,
	}, nil

}

func (store *storeServer) GetSortingGameList(ctx context.Context, req *pb.SortingParamRequest) (*pb.GameSimpleListResponse, error) {
	ctx = context.WithValue(ctx, "category", req.Category)
	ctx = context.WithValue(ctx, "page", req.Page)
	ctx = context.WithValue(ctx, "size", req.Size)
	ctx = context.WithValue(ctx, "sort", req.Sort)
	res, err := store.gameCtr.GetSortingGameList(ctx)
	if err != nil {
		return &pb.GameSimpleListResponse{
			Code:    31002,
			Message: "정렬된 게임 리스트 불러오기 에러 " + err.Error(),
		}, nil
	}
	return &pb.GameSimpleListResponse{
		Code:    31000,
		Message: "game list by category",
		Data:    res,
	}, nil
}

func (store *storeServer) GetGame(ctx context.Context, req *pb.GameIdQueryParamRequest) (*pb.GameDetailResponse, error) {
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	res, err := store.gameCtr.GetGameDetail(ctx)
	if err != nil {
		return &pb.GameDetailResponse{
			Code:    31001,
			Message: "게임 디테일 불러오기 에러 " + err.Error(),
		}, nil
	}
	return &pb.GameDetailResponse{
		Code:    31000,
		Message: "game",
		Data:    res,
	}, nil
}

func (store *storeServer) GetReviewList(ctx context.Context, req *pb.GameIdQueryParamRequest) (*pb.ReviewListResponse, error) {
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	res, err := store.gameCtr.GetReviewList(ctx)
	if err != nil {
		return &pb.ReviewListResponse{
			Code:    31020,
			Message: "리뷰 리스트 불러오기 에러 " + err.Error(),
		}, nil
	}
	return &pb.ReviewListResponse{
		Code:    31000,
		Message: "review list",
		Data:    res,
	}, nil
}

func (store *storeServer) GetUserData(ctx context.Context, _ *empty.Empty) (*pb.UserDataResponse, error) {
	userMetaData, err := model.ExtractMetadata(ctx)
	if err != nil {
		return nil, err
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	res, err := store.gameCtr.GetUserData(ctx)
	if err != nil {
		return &pb.UserDataResponse{
			Code:    31030,
			Message: "유저 데이터 불러오기 에러 " + err.Error(),
		}, nil
	}
	return &pb.UserDataResponse{
		Code:    31000,
		Message: "wishlist",
		Data:    res,
	}, nil
}

func (store *storeServer) GetGameListInWishlist(ctx context.Context, _ *empty.Empty) (*pb.GameSimpleListResponse, error) {
	userMetaData, err := model.ExtractMetadata(ctx)
	if err != nil {
		return nil, err
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	res, err := store.gameCtr.GetGameListInWishlist(ctx)
	if err != nil {
		return &pb.GameSimpleListResponse{
			Code:    31003,
			Message: "찜된 게임 목록 불러오기 에러 " + err.Error(),
		}, nil
	}
	return &pb.GameSimpleListResponse{
		Code:    31000,
		Message: "game list by category",
		Data:    res,
	}, nil
}

func (store *storeServer) PostWishlist(ctx context.Context, req *pb.GameIdQueryParamRequest) (*pb.IsSuccessResponse, error) {
	userMetaData, err := model.ExtractMetadata(ctx)
	if err != nil {
		return nil, err
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	res, err := store.gameCtr.PostWishlist(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    31031,
			Message: "찜 요청에 대한 에러 " + err.Error(),
		}, nil
	}
	return &pb.IsSuccessResponse{
		Code:    31000,
		Message: "찜 요청을 수행하였습니다.",
		Data:    res,
	}, nil
}

func (store *storeServer) DeleteWishlist(ctx context.Context, req *pb.GameIdQueryParamRequest) (*pb.IsSuccessResponse, error) {
	userMetaData, err := model.ExtractMetadata(ctx)
	if err != nil {
		return nil, err
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	res, err := store.gameCtr.DeleteWishlist(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    31001,
			Message: "찜 취소에 대한 에러 " + err.Error(),
		}, nil
	}
	return &pb.IsSuccessResponse{
		Code:    31000,
		Message: "찜 취소 요청을 수행하였습니다.",
		Data:    res,
	}, nil
}

func (store *storeServer) PostReview(ctx context.Context, req *pb.ReviewQueryRequest) (*pb.IsSuccessResponse, error) {
	userMetaData, err := model.ExtractMetadata(ctx)
	if err != nil {
		return nil, err
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	ctx = context.WithValue(ctx, "reviewContent", req.Content)
	ctx = context.WithValue(ctx, "reviewRecommendation", req.Recommendation)
	res, err := store.gameCtr.PostReview(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    31021,
			Message: "리뷰 포스팅에 대한 에러 " + err.Error(),
		}, nil
	}
	return &pb.IsSuccessResponse{
		Code:    31000,
		Message: "리뷰 포스팅을 수행하였습니다.",
		Data:    res,
	}, nil
}

func (store *storeServer) PatchReview(ctx context.Context, req *pb.ReviewQueryRequest) (*pb.IsSuccessResponse, error) {
	userMetaData, err := model.ExtractMetadata(ctx)
	if err != nil {
		return nil, err
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	ctx = context.WithValue(ctx, "reviewId", req.ReviewId)
	ctx = context.WithValue(ctx, "reviewContent", req.Content)
	ctx = context.WithValue(ctx, "reviewRecommendation", req.Recommendation)
	res, err := store.gameCtr.PatchReview(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    31022,
			Message: "리뷰 수정에 대한 에러 " + err.Error(),
		}, nil
	}
	return &pb.IsSuccessResponse{
		Code:    31000,
		Message: "리뷰 수정을 수행하였습니다.",
		Data:    res,
	}, nil
}
func (store *storeServer) DeleteReview(ctx context.Context, req *pb.ReviewQueryRequest) (*pb.IsSuccessResponse, error) {
	userMetaData, err := model.ExtractMetadata(ctx)
	if err != nil {
		return nil, err
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	ctx = context.WithValue(ctx, "reviewId", req.ReviewId)
	res, err := store.gameCtr.DeleteReview(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    31023,
			Message: "리뷰 삭제에 대한 에러 " + err.Error(),
		}, nil
	}
	return &pb.IsSuccessResponse{
		Code:    31000,
		Message: "리뷰 삭제를 수행하였습니다.",
		Data:    res,
	}, nil
}