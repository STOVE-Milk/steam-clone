package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"github.com/STOVE-Milk/steam-clone/store/dummy"
	pb "github.com/STOVE-Milk/steam-clone/store/proto"
	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc"
)

const portNumber = "8101"

type storeServer struct {
	pb.StoreServer
}

// GetUser returns user message by user_id
func (s *storeServer) GetCategoryList(ctx context.Context, _ *empty.Empty) (*pb.CategoryListResponse, error) {
	categories := []string{"액션", "RPG"}
	return &pb.CategoryListResponse{
		CategoryList: categories,
	}, nil
}

func (s *storeServer) GetGameListByCategory(ctx context.Context, req *pb.CategoryQueryParamRequest) (*pb.GameSimpleListResponse, error) {
	category := req.Category
	fmt.Println(category)
	var gameSimpleList = make([]*pb.GameSimple, len(dummy.GameSimpleList))
	for i, game := range dummy.GameSimpleList {
		gameSimpleList[i] = game
	}
	return &pb.GameSimpleListResponse{
		Games: gameSimpleList,
	}, nil
}

func main() {
	lis, err := net.Listen("tcp", ":"+portNumber)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()
	pb.RegisterStoreServer(grpcServer, &storeServer{})

	log.Printf("start gRPC server on %s port", portNumber)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}
