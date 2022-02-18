package repository

import (
	"context"
	"fmt"

	"github.com/STOVE-Milk/steam-clone/chat/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserMRepository struct {
	Db *mongo.Client
}

func (repo *UserMRepository) GetAllJoinedRoom(userId string) []models.RoomMongo {
	var res models.UserMongo
	chatCollection := repo.Db.Database("chat").Collection("users")
	findFilter := bson.D{{"id", userId}}
	chatCollection.FindOne(context.TODO(), findFilter).Decode(&res)
	if res.Id == "" {
		repo.AddUser(userId)
	}
	return res.Rooms
}

func (repo *UserMRepository) DeleteRoom(room models.Room, userId string) {
	chatCollection := repo.Db.Database("chat").Collection("users")
	pullFilter := bson.D{{"id", userId}}
	pullBson := bson.D{{"$pull",
		bson.D{{
			"rooms", bson.D{{"id", room.GetId()}},
		}},
	}}
	chatCollection.UpdateOne(context.TODO(), pullFilter, pullBson)

}

// 사용자가 등록이 돼 있지 않다면 document 생성
func (repo *UserMRepository) AddUser(userId string) {
	chatCollection := repo.Db.Database("chat").Collection("users")
	userInfo := models.UserMongo{
		Id:    userId,
		Rooms: make([]models.RoomMongo, 0),
	}
	chatCollection.InsertOne(context.TODO(), userInfo)
	fmt.Println("abcx")
}

func (repo *UserMRepository) AddRoom(room models.Room, userId string) {
	chatCollection := repo.Db.Database("chat").Collection("users")
	findFilter := bson.D{{"id", userId}}
	check := chatCollection.FindOne(context.TODO(), findFilter)
	if check.Err() != nil {
		repo.AddUser(userId)
	}

	roomInfo := Room{
		Id:      room.GetId(),
		Name:    room.GetName(),
		Private: room.GetPrivate(),
	}
	updateFilter := bson.D{{"id", userId}}
	updateBson := bson.D{{"$push",
		bson.D{{
			"rooms", roomInfo,
		}},
	}}
	chatCollection.UpdateOne(context.TODO(), updateFilter, updateBson)
}
