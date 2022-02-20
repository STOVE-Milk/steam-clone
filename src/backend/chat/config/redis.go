package config

import (
	"fmt"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
)

type redisConfig struct {
	redisHost string
	redisPort string
}

func (cfg redisConfig) String() string {
	return fmt.Sprintf("redis://%s:%s/0", cfg.redisHost, cfg.redisPort)
}

func makeRedisConfig() string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Panic(err)
	}
	cfg := &redisConfig{
		redisHost: os.Getenv("REDISHOST"),
		redisPort: os.Getenv("REDISPORT"),
	}
	return string(cfg.String())
}

var Redis *redis.Client

func CreateRedisClient() {
	opt, err := redis.ParseURL(makeRedisConfig())
	if err != nil {
		panic(err)
	}

	Redis = redis.NewClient(opt)
}
