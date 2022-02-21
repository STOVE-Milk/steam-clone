package service

import (
	"context"
	"database/sql"

	"github.com/STOVE-Milk/steam-clone/store/models"
	pb "github.com/STOVE-Milk/steam-clone/store/proto"
	"github.com/STOVE-Milk/steam-clone/store/repository"
	"google.golang.org/protobuf/types/known/timestamppb"
)

// 응답 요청에 대한 비지니스 로직을 관리하는 패키지입니다.
// 주로 파싱의 역할을 합니다.
// interface의 값을 원하는 타입으로 캐스팅 하는곳에서 패닉 에러가 자주 발생하기에 이부분에서 서버가 자주 죽는것을 확인하였습니다.
// 이를 reverse를 통해 해결하였습니다.
// 또한 컨텍스트를 사용하여 repo에서 필요한 데이터를 옮김으로써 직접적으로 많은 값을 넘겨야 하는 함수를 만들지 않을 수 있었습니다.

type GameService struct {
	r *repository.Repo
}

func NewGameCtr(db *sql.DB) *GameService {
	return &GameService{
		r: repository.NewGameRepo(db),
	}
}

func (gc *GameService) GetParentCategoryList(ctx context.Context) (*pb.CategoryListResponse_CategoryList, *models.Error) {
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

func (gc *GameService) GetUserData(ctx context.Context) (*pb.UserDataResponse_UserData, *models.Error) {
	wishlist, err := gc.r.GetWishlist(ctx)
	if err != nil {
		return nil, err
	}
	library, err := gc.r.GetPurchaseList(ctx)
	if err != nil {
		return nil, err
	}
	var pbUserData pb.UserDataResponse_UserData
	pbUserData.WishList = wishlist
	pbUserData.PurchaseList = library
	return &pbUserData, nil
}

func (gc *GameService) GetGameDetail(ctx context.Context) (*pb.GameDetailResponse_Game, *models.Error) {
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
	imageSub := make([]string, 0)
	videoSub := make([]string, 0)
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
	return &pb.GameDetailResponse_Game{
		Game: &pb.GameDetail{
			Id:                 int32(gameDetail.Id),
			Name:               gameDetail.Name,
			DescriptionSnippet: gameDetail.DescriptionSnippet,
			Price:              int32(gameDetail.Price["KR"].(float64)),
			Sale:               int32(gameDetail.Sale),
			Image: &pb.ContentsPath{
				Main: gameDetail.Image["main"].(string),
				Sub:  imageSub,
			},
			Video: &pb.ContentsPath{
				Main: gameDetail.Video["main"].(string),
				Sub:  videoSub,
			},
			CategoryList:  categoryTmp,
			OsList:        gameDetail.Os.ToSlice(),
			DownloadCount: int32(gameDetail.DownloadCount),
			Language:      gameDetail.Language.ToSlice(),
			Description:   gameDetail.Description,
			Publisher: &pb.Publisher{
				Id:   int32(gamePublisher.Id),
				Name: gamePublisher.Name,
			},
			ReviewCount:    int32(gameDetail.ReviewCount),
			RecommendCount: int32(gameDetail.RecommendCount),
		},
	}, nil
}

func (gc *GameService) GetSortingGameList(ctx context.Context) (*pb.GameSimpleListResponse_GameSimpleList, *models.Error) {
	gameSimpleList, err := gc.r.GetSortingGameList(ctx)
	if err != nil {
		return nil, err
	}
	pbGameSimpleList, err := gc.parsingGameSimpleList(ctx, gameSimpleList)
	if err != nil {
		return nil, err
	}

	return pbGameSimpleList, nil
}

func (gc *GameService) GetReviewList(ctx context.Context) (*pb.ReviewListResponse_ReviewList, *models.Error) {
	reviewList, err := gc.r.GetReviewList(ctx)
	if err != nil {
		return nil, err
	}

	var pbReviewList pb.ReviewListResponse_ReviewList
	pbReviewList.ReviewList = make([]*pb.Review, len(reviewList))
	for i, review := range reviewList {
		profile_image, ok := review.Profile["image"].(string)
		if !ok {
			profile_image = ""
		}
		profile_description, ok := review.Profile["description"].(string)
		if !ok {
			profile_description = ""
		}
		pbReviewList.ReviewList[i] = &pb.Review{
			Id:            int32(review.Id),
			UserId:        int32(review.UserId),
			DisplayedName: review.DisplayedName,
			Profile: &pb.Review_Profile{
				Image:       profile_image,
				Description: profile_description,
			},
			Content:        review.Content,
			Recommendation: int32(review.Recommendation),
			CreatedAt:      timestamppb.New(review.CreatedAt),
			UpdatedAt:      timestamppb.New(review.UpdatedAt),
		}
	}
	return &pbReviewList, nil
}

func (gc *GameService) GetGameListInWishlist(ctx context.Context) (*pb.GameSimpleListResponse_GameSimpleList, *models.Error) {
	gameSimpleList, err := gc.r.GetGameListInWishlist(ctx)
	if err != nil {
		return nil, err
	}
	pbGameSimpleList, err := gc.parsingGameSimpleList(ctx, gameSimpleList)
	if err != nil {
		return nil, err
	}
	return pbGameSimpleList, nil
}
func (gc *GameService) GetGameListByUserId(ctx context.Context) (*pb.GameSimpleListResponse_GameSimpleList, *models.Error) {
	gameSimpleList, err := gc.r.GetGameListByUserId(ctx)
	if err != nil {
		return nil, err
	}
	pbGameSimpleList, err := gc.parsingGameSimpleList(ctx, gameSimpleList)
	if err != nil {
		return nil, err
	}

	return pbGameSimpleList, nil
}
func (gc *GameService) PostWishlist(ctx context.Context) (*pb.IsSuccessResponse_Success, *models.Error) {
	isSuccess, err := gc.r.PostWishlist(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}

func (gc *GameService) DeleteWishlist(ctx context.Context) (*pb.IsSuccessResponse_Success, *models.Error) {
	isSuccess, err := gc.r.DeleteWishlist(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}

func (gc *GameService) PostReview(ctx context.Context) (*pb.IsSuccessResponse_Success, *models.Error) {
	isSuccess, err := gc.r.PostReview(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}

func (gc *GameService) PatchReview(ctx context.Context) (*pb.IsSuccessResponse_Success, *models.Error) {
	isSuccess, err := gc.r.PatchReview(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}

func (gc *GameService) DeleteReview(ctx context.Context) (*pb.IsSuccessResponse_Success, *models.Error) {
	isSuccess, err := gc.r.DeleteReview(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}

func (gc *GameService) GetGameListInCart(ctx context.Context) (*pb.GameSimpleListResponse_GameSimpleList, *models.Error) {
	gameSimpleList, err := gc.r.GetGameListInCart(ctx)
	if err != nil {
		return nil, err
	}
	pbGameSimpleList, err := gc.parsingGameSimpleList(ctx, gameSimpleList)
	if err != nil {
		return nil, err
	}
	return pbGameSimpleList, nil
}

func (gc *GameService) GetSearchingGameList(ctx context.Context) (*pb.GameSimpleListResponse_GameSimpleList, *models.Error) {
	gameSimpleList, err := gc.r.GetSearchingGameList(ctx)
	if err != nil {
		return nil, err
	}
	pbGameSimpleList, err := gc.parsingGameSimpleList(ctx, gameSimpleList)
	if err != nil {
		return nil, err
	}
	return pbGameSimpleList, nil
}

func (gc *GameService) GameInstall(ctx context.Context) (*pb.IsSuccessResponse_Success, *models.Error) {
	isSuccess, err := gc.r.GameInstall(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}

func (gc *GameService) GameUninstall(ctx context.Context) (*pb.IsSuccessResponse_Success, *models.Error) {
	isSuccess, err := gc.r.GameUninstall(ctx)
	if err != nil {
		return nil, err
	}
	return &pb.IsSuccessResponse_Success{
		Success: isSuccess,
	}, nil
}

func (gc *GameService) parsingGameSimpleList(ctx context.Context, gameSimpleList []*models.GameSimple) (*pb.GameSimpleListResponse_GameSimpleList, *models.Error) {
	var pbGameSimpleList pb.GameSimpleListResponse_GameSimpleList
	pbGameSimpleList.GameList = make([]*pb.GameSimple, len(gameSimpleList))
	for i, game := range gameSimpleList {
		ctx = context.WithValue(ctx, "gameId", int32(game.Id))
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
		pbGameSimpleList.GameList[i] = &pb.GameSimple{
			Id:                 int32(game.Id),
			Name:               game.Name,
			DescriptionSnippet: game.DescriptionSnippet,
			Price:              int32(game.Price["KR"].(float64)),
			Sale:               int32(game.Sale),
			ReviewCount:        int32(game.ReviewCount),
			RecommendCount:     int32(game.RecommendCount),
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
