package controller

import (
	"context"

	pb "github.com/STOVE-Milk/steam-clone/store/proto"
	"github.com/STOVE-Milk/steam-clone/store/service"
	"github.com/STOVE-Milk/steam-clone/store/token"
	"github.com/STOVE-Milk/steam-clone/store/utils"
	"github.com/golang/protobuf/ptypes/empty"
)

type storeServer struct {
	pb.StoreServer
	GameCtr *service.GameService
}

func Server() *storeServer {
	return &storeServer{}
}

func (store *storeServer) GetCategoryList(ctx context.Context, _ *empty.Empty) (*pb.CategoryListResponse, error) {
	res, err := store.GameCtr.GetParentCategoryList(ctx)
	if err != nil {
		return &pb.CategoryListResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.CategoryListResponse{
		Code:    31000,
		Message: "category list",
		Data:    res,
	}, nil

}

func (store *storeServer) GetSortingGameList(ctx context.Context, req *pb.SortingParamRequest) (*pb.GameSimpleListResponse, error) {
	defer utils.Recover()
	ctx = context.WithValue(ctx, "category", req.Category)
	ctx = context.WithValue(ctx, "page", req.Page)
	ctx = context.WithValue(ctx, "size", req.Size)
	ctx = context.WithValue(ctx, "sort", req.Sort)
	res, err := store.GameCtr.GetSortingGameList(ctx)
	if err != nil {
		return &pb.GameSimpleListResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.GameSimpleListResponse{
		Code:    31000,
		Message: "game list by category",
		Data:    res,
	}, nil
}

func (store *storeServer) GetGame(ctx context.Context, req *pb.GameIdQueryParamRequest) (*pb.GameDetailResponse, error) {
	defer utils.Recover()
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	res, err := store.GameCtr.GetGameDetail(ctx)
	if err != nil {
		return &pb.GameDetailResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.GameDetailResponse{
		Code:    31000,
		Message: "game",
		Data:    res,
	}, nil
}

func (store *storeServer) GetReviewList(ctx context.Context, req *pb.GameIdQueryParamRequest) (*pb.ReviewListResponse, error) {
	defer utils.Recover()
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	res, err := store.GameCtr.GetReviewList(ctx)
	if err != nil {
		return &pb.ReviewListResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.ReviewListResponse{
		Code:    31000,
		Message: "review list",
		Data:    res,
	}, nil
}

func (store *storeServer) GetUserData(ctx context.Context, _ *empty.Empty) (*pb.UserDataResponse, error) {
	defer utils.Recover()
	userMetaData, err := token.ExtractMetadata(ctx)
	if err != nil {
		return &pb.UserDataResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	res, err := store.GameCtr.GetUserData(ctx)
	if err != nil {
		return &pb.UserDataResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.UserDataResponse{
		Code:    31000,
		Message: "wishlist",
		Data:    res,
	}, nil
}

func (store *storeServer) GetGameListInWishlist(ctx context.Context, _ *empty.Empty) (*pb.GameSimpleListResponse, error) {
	defer utils.Recover()
	userMetaData, err := token.ExtractMetadata(ctx)
	if err != nil {
		return &pb.GameSimpleListResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	res, err := store.GameCtr.GetGameListInWishlist(ctx)
	if err != nil {
		return &pb.GameSimpleListResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.GameSimpleListResponse{
		Code:    31000,
		Message: "game list by category",
		Data:    res,
	}, nil
}

func (store *storeServer) GetGameListInCart(ctx context.Context, req *pb.GameIdListQueryParamRequest) (*pb.GameSimpleListResponse, error) {
	defer utils.Recover()
	ctx = context.WithValue(ctx, "gameIdList", req.GameIdList)
	res, err := store.GameCtr.GetGameListInCart(ctx)
	if err != nil {
		return &pb.GameSimpleListResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.GameSimpleListResponse{
		Code:    31000,
		Message: "game list by cart",
		Data:    res,
	}, nil
}

func (store *storeServer) PostWishlist(ctx context.Context, req *pb.GameIdQueryParamRequest) (*pb.IsSuccessResponse, error) {
	defer utils.Recover()
	userMetaData, err := token.ExtractMetadata(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	res, err := store.GameCtr.PostWishlist(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.IsSuccessResponse{
		Code:    31000,
		Message: "찜 요청을 수행하였습니다.",
		Data:    res,
	}, nil
}

func (store *storeServer) DeleteWishlist(ctx context.Context, req *pb.GameIdQueryParamRequest) (*pb.IsSuccessResponse, error) {
	defer utils.Recover()
	userMetaData, err := token.ExtractMetadata(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	res, err := store.GameCtr.DeleteWishlist(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.IsSuccessResponse{
		Code:    31000,
		Message: "찜 취소 요청을 수행하였습니다.",
		Data:    res,
	}, nil
}

func (store *storeServer) PostReview(ctx context.Context, req *pb.ReviewQueryRequest) (*pb.IsSuccessResponse, error) {
	defer utils.Recover()
	userMetaData, err := token.ExtractMetadata(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	ctx = context.WithValue(ctx, "reviewContent", req.Content)
	ctx = context.WithValue(ctx, "reviewRecommendation", req.Recommendation)
	res, err := store.GameCtr.PostReview(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.IsSuccessResponse{
		Code:    31000,
		Message: "리뷰 포스팅을 수행하였습니다.",
		Data:    res,
	}, nil
}

func (store *storeServer) PatchReview(ctx context.Context, req *pb.ReviewQueryRequest) (*pb.IsSuccessResponse, error) {
	defer utils.Recover()
	userMetaData, err := token.ExtractMetadata(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	ctx = context.WithValue(ctx, "gameId", req.GameId)
	ctx = context.WithValue(ctx, "reviewId", req.ReviewId)
	ctx = context.WithValue(ctx, "reviewContent", req.Content)
	ctx = context.WithValue(ctx, "reviewRecommendation", req.Recommendation)
	res, err := store.GameCtr.PatchReview(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.IsSuccessResponse{
		Code:    31000,
		Message: "리뷰 수정을 수행하였습니다.",
		Data:    res,
	}, nil
}
func (store *storeServer) DeleteReview(ctx context.Context, req *pb.ReviewQueryRequest) (*pb.IsSuccessResponse, error) {
	defer utils.Recover()
	userMetaData, err := token.ExtractMetadata(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	ctx = context.WithValue(ctx, "userId", userMetaData.UserId)
	ctx = context.WithValue(ctx, "nickname", userMetaData.Nickname)
	ctx = context.WithValue(ctx, "reviewId", req.ReviewId)
	res, err := store.GameCtr.DeleteReview(ctx)
	if err != nil {
		return &pb.IsSuccessResponse{
			Code:    int32(err.Code),
			Message: err.Message,
		}, nil
	}
	return &pb.IsSuccessResponse{
		Code:    31000,
		Message: "리뷰 삭제를 수행하였습니다.",
		Data:    res,
	}, nil
}
