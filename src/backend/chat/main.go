package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"strings"

	"github.com/STOVE-Milk/steam-clone/chat/config"
	"github.com/STOVE-Milk/steam-clone/chat/repository"
)

var addr = flag.String("addr", ":8102", "http server address")
var ctx = context.Background()

func preflightHandler(w http.ResponseWriter, r *http.Request) {
	headers := []string{"Content-Type", "Accept", "Authorization"}
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
	flag.Parse()

	config.CreateRedisClient()
	db := config.InitDB()
	defer db.Close()
	mongo := config.MongoConn()
	defer mongo.Disconnect(context.TODO())

	serveMux := http.NewServeMux()

	wsServer := NewWebsocketServer(&repository.RoomMRepository{Db: mongo}, &repository.UserMRepository{Db: mongo}, &repository.UserRepository{Db: db})
	go wsServer.Run()

	serveMux.HandleFunc("/chat/ws", func(w http.ResponseWriter, r *http.Request) {
		ServeWs(wsServer, w, r)
	})
	fs := http.FileServer(http.Dir("./public"))
	serveMux.Handle("/", fs)
	log.Fatal(http.ListenAndServe(*addr, allowCORS(serveMux)))
}
