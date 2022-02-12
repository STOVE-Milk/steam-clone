package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func GetSecretKey() string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Panic(err)
	}
	return os.Getenv("SECRET")
}
