package main

import (
	"context"
	storePb "github.com/STOVE-Milk/steam-clone/gRPC-gateway/proto"
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"google.golang.org/grpc"
	"log"
	"net/http"
	"strings"
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

func preflightHandler(w http.ResponseWriter, r *http.Request) {
	headers := []string{"Content-Type", "Accept"}
	w.Header().Set("Access-Control-Allow-Headers", strings.Join(headers, ","))
	methods := []string{"GET", "HEAD", "POST", "PUT", "DELETE"}
	w.Header().Set("Access-Control-Allow-Methods", strings.Join(methods, ","))
	return
}

func allowCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if origin := r.Header.Get("Origin"); origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			if r.Method == "OPTIONS" && r.Header.Get("Access-Control-Request-Method") != "" {
				preflightHandler(w, r)
				return
			}
		}
		h.ServeHTTP(w, r)
	})
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
	if err := http.ListenAndServe(":"+gRPCGatewayPortNumber, allowCORS(mux)); err != nil {
		log.Fatalf("failed to serve: %s", err)
	}
}
