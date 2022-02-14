package main

import (
	"log"
	"net"

	"github.com/STOVE-Milk/steam-clone/store/config"
	"github.com/STOVE-Milk/steam-clone/store/controller"
	"github.com/STOVE-Milk/steam-clone/store/errors"
	pb "github.com/STOVE-Milk/steam-clone/store/proto"
	"github.com/STOVE-Milk/steam-clone/store/service"
	"google.golang.org/grpc"
)

const portNumber = "8101"

// 상점 서버를 위한 Init을 실행합니다.
func Run() error {
	db := config.InitDB()
	defer db.Close()

	errors.Errors = config.InitError().StoreError

	lis, err := net.Listen("tcp", ":"+portNumber)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	// gRPC 객체를 생성합니다.
	grpcServer := grpc.NewServer()

	storeServer := controller.Server()
	storeServer.GameCtr = service.NewGameCtr(db)

	// gRPC 객체와 연결합니다.
	pb.RegisterStoreServer(grpcServer, storeServer)

	log.Printf("start gRPC server on %s port", portNumber)
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
	return nil
}
