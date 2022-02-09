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

func (repo *UserMRepository) GetAllJoinedRoom(user models.User) []models.Room {
	var rooms []models.Room
	chatCollection := repo.Db.Database("chat").Collection("users")
	findFilter := bson.D{{"id", user.GetId()}}
	chatCollection.FindOne(context.TODO(), findFilter).Decode(&rooms)
	fmt.Println(rooms)
	return rooms
}

func (repo *UserMRepository) DeleteRoom(room models.Room, user models.User) {
	chatCollection := repo.Db.Database("chat").Collection("users")
	pullFilter := bson.D{{"id", user.GetId()}}
	pullBson := bson.D{{"$pull",
		bson.D{{
			"rooms", room,
		}},
	}}
	chatCollection.UpdateOne(context.TODO(), pullFilter, pullBson)

}

// 사용자가 등록이 돼 있지 않다면 document 생성
func (repo *UserMRepository) AddUser(user models.User) {
	chatCollection := repo.Db.Database("chat").Collection("users")
	userInfo := User{
		Id: user.GetId(),
	}
	chatCollection.InsertOne(context.TODO(), userInfo)
}

func (repo *UserMRepository) AddRoom(room models.Room, user models.User) {
	chatCollection := repo.Db.Database("chat").Collection("users")
	roomInfo := Room{
		Id:      room.GetId(),
		Name:    room.GetName(),
		Private: room.GetPrivate(),
	}
	updateFilter := bson.D{{"id", user.GetId()}}
	updateBson := bson.D{{"$push",
		bson.D{{
			"rooms", roomInfo,
		}},
	}}
	chatCollection.UpdateOne(context.TODO(), updateFilter, updateBson)
}
