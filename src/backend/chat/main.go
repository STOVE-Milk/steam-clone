package main

import (
	"context"
	"flag"
	"log"
	"net/http"

	"github.com/STOVE-Milk/steam-clone/chat/config"
	"github.com/STOVE-Milk/steam-clone/chat/repository"
)

var addr = flag.String("addr", ":8102", "http server address")
var ctx = context.Background()

func main() {
	flag.Parse()

	config.CreateRedisClient()
	db := config.InitDB()
	defer db.Close()
	mongo := config.MongoConn()
	defer mongo.Disconnect(context.TODO())

	wsServer := NewWebsocketServer(&repository.RoomRepository{Db: mongo}, &repository.UserRepository{Db: db})
	go wsServer.Run()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ServeWs(wsServer, w, r)
	})

	fs := http.FileServer(http.Dir("./public"))
	http.Handle("/", fs)

	log.Fatal(http.ListenAndServe(*addr, nil))
}
