package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"github.com/STOVE-Milk/steam-clone/store/config"
	pb "github.com/STOVE-Milk/steam-clone/store/proto"
	"github.com/STOVE-Milk/steam-clone/store/repository"
	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc"
)

const portNumber = "8101"

type storeServer struct {
	pb.StoreServer
	game repository.GameRepository
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
	storeServer := &storeServer{game: repository.GameRepository{Db: db}}
	pb.RegisterStoreServer(grpcServer, storeServer)

	log.Printf("start gRPC server on %s port", portNumber)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
	return nil
}

// GetUser returns user message by user_id
func (store *storeServer) GetCategoryList(ctx context.Context, _ *empty.Empty) (*pb.CategoryListResponse, error) {
	categoryList, err := store.game.GetCategoryList(ctx)
	res := make([]string, len(categoryList))
	for i, category := range categoryList {
		res[i] = category.Name
	}
	if err != nil {
		log.Fatal(err)
		return &pb.CategoryListResponse{
			Code:    21000,
			Message: "can not get category list",
		}, nil
	}
	fmt.Println("Aaaaaaaaaaaaaaaa")
	return &pb.CategoryListResponse{
		Code:    21000,
		Message: "category list",
		Data:    &pb.CategoryListResponse_CategoryList{CategoryList: res},
	}, nil

}

func (store *storeServer) GetGameListByCategory(ctx context.Context, req *pb.CategoryQueryParamRequest) (*pb.GameSimpleListResponse, error) {
	category := req.Category
	gameList, err := store.game.GetGameListByCategory(ctx, category)
	if err != nil {
		log.Fatal(err)
		return &pb.GameSimpleListResponse{
			Code:    21000,
			Message: "can not get game list : " + err.Error(),
		}, nil
	}
	res := make([]*pb.GameSimple, len(gameList))
	for i, game := range gameList {
		var imageSub []string
		var videoSub []string
		for _, image := range game.Image["sub"].([]interface{}) {
			imageSub = append(imageSub, image.(string))
		}
		for _, video := range game.Video["sub"].([]interface{}) {
			videoSub = append(videoSub, video.(string))
		}

		res[i] = &pb.GameSimple{
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
			OsList: []string{"macOs, Window10"},
		}
	}
	return &pb.GameSimpleListResponse{
		Code:    21000,
		Message: "game list by category : ",
		Data:    &pb.GameSimpleListResponse_GameSimpleList{GameSimpleList: res},
	}, nil
}
