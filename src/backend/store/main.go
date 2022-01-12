package main

import (
	"context"
	"log"
	"net"

	pb "github.com/STOVE-Milk/steam-clone/store/proto"
	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc"
)

const portNumber = "8101"

type storeServer struct {
	pb.StoreServer
}

// GetUser returns user message by user_id
func (s *storeServer) GetCategories(ctx context.Context, _ *empty.Empty) (*pb.CategoryListRequest, error) {
	categories := []string{"액션", "RPG"}
	return &pb.CategoryListRequest{
		CategoryList: categories,
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
