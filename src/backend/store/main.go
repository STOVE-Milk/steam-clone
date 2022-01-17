package main

import (
	"context"
)

func main() {

	ctx := context.Background()
	err := Server().Run(ctx)
	if err != nil {
		panic(err)
	}
}
