package main

import (
	"context"
	"log"
	"net/http"

	storePb "github.com/STOVE-Milk/steam-clone/gRPC-gateway/proto"
	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
)

const (
	portNumber            = "8100"
	storeServerPortNumber = "8101"
	host                  = "localhost:"
)

func main() {
	ctx := context.Background()
	mux := runtime.NewServeMux()
	options := []grpc.DialOption{
		grpc.WithInsecure(),
	}

	if err := storePb.RegisterStoreHandlerFromEndpoint(
		ctx,
		mux,
		host+storeServerPortNumber,
		options,
	); err != nil {
		log.Fatalf("failed to register gRPC gateway: %v", err)
	}

	log.Printf("start HTTP server on %s port", portNumber)
	if err := http.ListenAndServe(":"+portNumber, mux); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}
