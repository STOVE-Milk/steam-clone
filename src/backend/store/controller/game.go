package controller

import (
	"context"
	"database/sql"

	pb "github.com/STOVE-Milk/steam-clone/store/proto"

	"github.com/STOVE-Milk/steam-clone/store/repository"
)

type GameController struct {
	r *repository.Repo
}

func NewGameCtr(db *sql.DB) *GameController {
	return &GameController{
		r: repository.NewGameRepo(db),
	}
}

func (gc *GameController) GetParentCategoryList(ctx context.Context) (*pb.CategoryListResponse_CategoryList, error) {
	parentCategoryList, err := gc.r.GetAllCategoryList(ctx)
	if err != nil {
		return nil, err
	}

	var pbCategoryList pb.CategoryListResponse_CategoryList

	for _, category := range parentCategoryList {
		if category.Id == category.ParentIdx {
			pbCategoryList.CategoryList = append(pbCategoryList.CategoryList, category.Name)
		}
	}
	return &pbCategoryList, nil
}

func (gc *GameController) GetWishlist(ctx context.Context) (*pb.WishlistResponse_Wishlist, error) {
	wishlist, err := gc.r.GetWishlist(ctx)
	if err != nil {
		return nil, err
	}
	var pbWishlist pb.WishlistResponse_Wishlist
	pbWishlist.Wishlist = wishlist
	return &pbWishlist, nil
}

func (gc *GameController) GetGameDetail(ctx context.Context) (*pb.GameDetail, error) {
	gameDetail, err := gc.r.GetGameDetail(ctx)
	if err != nil {
		return nil, err
	}
	categoryList, err := gc.r.GetCategoryListByGameId(ctx)
	if err != nil {
		return nil, err
	}
	categoryTmp := make([]string, len(categoryList))
	for i, category := range categoryList {
		categoryTmp[i] = category.Name
	}
	var imageSub []string
	var videoSub []string
	for _, image := range gameDetail.Image["sub"].([]interface{}) {
		imageSub = append(imageSub, image.(string))
	}
	for _, video := range gameDetail.Video["sub"].([]interface{}) {
		videoSub = append(videoSub, video.(string))
	}
	gamePublisher, err := gc.r.GetPublisher(ctx, gameDetail.PublisherId)
	if err != nil {
		return nil, err
	}
	return &pb.GameDetail{
		GameId:             int32(gameDetail.Id),
		Name:               gameDetail.Name,
		DescriptionSnippet: gameDetail.DescriptionSnippet,
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
		CategoryList: categoryTmp,
		OsList:       gameDetail.Os.ToSlice(),
		Language:     gameDetail.Language.ToSlice(),
		Description:  gameDetail.Description,
		Publisher: &pb.Publisher{
			Id:   int32(gamePublisher.Id),
			Name: gamePublisher.Name,
		},
		ReviewCount:    int32(gameDetail.ReviewCount),
		RecommendCount: int32(gameDetail.RecommendCount),
	}, nil
}

func (gc *GameController) GetSortingGameList(ctx context.Context) (*pb.GameSimpleListResponse_GameSimpleList, error) {
	gameSimpleList, err := gc.r.GetSortingGameList(ctx)
	if err != nil {
		return nil, err
	}
	var pbGameSimpleList pb.GameSimpleListResponse_GameSimpleList
	pbGameSimpleList.GameSimpleList = make([]*pb.GameSimple, len(gameSimpleList))
	for i, game := range gameSimpleList {
		categoryList, err := gc.r.GetCategoryListByGameId(ctx)
		if err != nil {
			return nil, err
		}
		categoryTmp := make([]string, len(categoryList))
		for i, category := range categoryList {
			categoryTmp[i] = category.Name
		}
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
			OsList:        game.Os.ToSlice(),
			CategoryList:  categoryTmp,
			DownloadCount: int32(game.DownloadCount),
		}
	}

	return &pbGameSimpleList, nil
}

func (gc *GameController) GetReviewList(ctx context.Context) (*pb.ReviewListResponse_ReviewList, error) {
	reviewList, err := gc.r.GetReviewList(ctx)
	if err != nil {
		return nil, err
	}
	var pbReviewList pb.ReviewListResponse_ReviewList
	pbReviewList.ReviewList = make([]*pb.Review, len(reviewList))
	for i, review := range reviewList {
		pbReviewList.ReviewList[i] = &pb.Review{
			Id:             int32(review.Id),
			UserId:         int32(review.UserId),
			DisplayedName:  review.DisplayedName,
			Content:        review.Content,
			Recommendation: int32(review.Recommendation),
		}
	}
	return &pbReviewList, nil
}

func (gc *GameController) GetGameListInWishlist(ctx context.Context) (*pb.GameSimpleListResponse_GameSimpleList, error) {
	gameSimpleList, err := gc.r.GetGameListInWishlist(ctx)
	if err != nil {
		return nil, err
	}
	var pbGameSimpleList pb.GameSimpleListResponse_GameSimpleList
	pbGameSimpleList.GameSimpleList = make([]*pb.GameSimple, len(gameSimpleList))
	for i, game := range gameSimpleList {
		categoryList, err := gc.r.GetCategoryListByGameId(ctx)
		if err != nil {
			return nil, err
		}
		categoryTmp := make([]string, len(categoryList))
		for i, category := range categoryList {
			categoryTmp[i] = category.Name
		}
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
			OsList:        game.Os.ToSlice(),
			CategoryList:  categoryTmp,
			DownloadCount: int32(game.DownloadCount),
		}
	}

	return &pbGameSimpleList, nil
}

func (gc *GameController) PostWishlist(ctx context.Context) (*pb.IsSuccessResponse_Success, error) {
	isSuccess, err := gc.r.PostWishlist(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}

func (gc *GameController) DeleteWishlist(ctx context.Context) (*pb.IsSuccessResponse_Success, error) {
	isSuccess, err := gc.r.DeleteWishlist(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}

func (gc *GameController) PostReview(ctx context.Context) (*pb.IsSuccessResponse_Success, error) {
	isSuccess, err := gc.r.PostReview(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}

func (gc *GameController) PatchReview(ctx context.Context) (*pb.IsSuccessResponse_Success, error) {
	isSuccess, err := gc.r.PatchReview(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}

func (gc *GameController) DeleteReview(ctx context.Context) (*pb.IsSuccessResponse_Success, error) {
	isSuccess, err := gc.r.DeleteReview(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}
