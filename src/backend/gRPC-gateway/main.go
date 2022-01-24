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
	storeServerHost       = "localhost:"
	gRPCGatewayHost       = "grpc_gateway:"
)

func CustomMatcher(key string) (string, bool) {
	switch key {
	case "authorization":
		return "authorization", true
	default:
		return key, false
	}
}

func registerServiceHandlers(ctx context.Context, mux *runtime.ServeMux) error {
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
		return err
	}

	return nil
}

func main() {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()
	mux := runtime.NewServeMux(
		runtime.WithIncomingHeaderMatcher(CustomMatcher),
	)

	registerServiceHandlers(ctx, mux)

	log.Printf("start HTTP server on %s port", gRPCGatewayPortNumber)
	if err := http.ListenAndServe(":"+gRPCGatewayPortNumber, mux); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}
