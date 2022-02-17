package utils

import (
	"fmt"
	"log"
	"runtime/debug"

	storeErr "github.com/STOVE-Milk/steam-clone/store/errors"
	"github.com/STOVE-Milk/steam-clone/store/models"
)

func ErrorHandler(errName string, err error) *models.Error {
	log.Println(err)
	return storeErr.Errors[errName]
}

func Recover() {
	if r := recover(); r != nil {
		fmt.Println("Recovered : ", r)
		debug.PrintStack()
	}
}
