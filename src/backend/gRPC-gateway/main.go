package main

import (
	"context"
	"log"
	"net/http"

	storePb "github.com/STOVE-Milk/steam-clone/gRPC-gateway/proto"
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"google.golang.org/grpc"
)

const (
	gRPCGatewayPortNumber = "8100"
	storeServerPortNumber = "8101"
	storeServerHost       = "store:"
	gRPCGatewayHost       = "grpc_gateway:"
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
		storeServerHost+storeServerPortNumber,
		options,
	); err != nil {
		log.Fatalf("failed to register gRPC gateway: %v", err)
	}

	log.Printf("start HTTP server on %s port", gRPCGatewayPortNumber)
	if err := http.ListenAndServe(":"+gRPCGatewayPortNumber, mux); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}
