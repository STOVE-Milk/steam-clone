package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type mongoConfig struct {
	mongoHost   string
	mongoPort   string
	mongoUser   string
	mongoPwd    string
	mongoDbName string
}

func (cfg mongoConfig) String() string {
	return fmt.Sprintf("mongodb://%s:%s@%s:%s/%s", cfg.mongoUser, cfg.mongoPwd, cfg.mongoHost, cfg.mongoPort, cfg.mongoDbName)
}

func makeMongoConfig() string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Panic(err)
	}
	cfg := &mongoConfig{
		mongoHost:   os.Getenv("MONGOHOST"),
		mongoPort:   os.Getenv("MONGOPORT"),
		mongoUser:   os.Getenv("MONGOUSER"),
		mongoPwd:    os.Getenv("MONGOPWD"),
		mongoDbName: os.Getenv("MONGODBNAME"),
	}
	return string(cfg.String())
}

func MongoConn() *mongo.Client {

	clientOptions := options.Client().ApplyURI("mongodb://milk:milk@fortice.iptime.org:27017/chat")
	// clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	conn, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = conn.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("MongoDB Connection Made")
	return conn
}

// room get , room view 안됨
