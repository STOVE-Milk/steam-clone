package main

import (
	"fmt"
	"net/http"
	"sync"

	"github.com/STOVE-Milk/steam-clone/chat-lb/lb"
)

func serveBackend(name string, port string) {
	mux := http.NewServeMux()
	mux.Handle("/chat/ws", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Backend server name:%v\n", name)
		fmt.Fprintf(w, "Response header:%v\n", r.Header)
	}))
	http.ListenAndServe(port, mux)
}

// 고루틴을 이용해 load balancing
func main() {
	wg := new(sync.WaitGroup)
	wg.Add(1)

	go func() {
		lb.Serve()
		wg.Done()
	}()
	wg.Wait()
}
