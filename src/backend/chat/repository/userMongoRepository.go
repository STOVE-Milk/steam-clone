package repository

import (
	"context"

	"github.com/STOVE-Milk/steam-clone/chat/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserMRepository struct {
	Db *mongo.Client
}

func (repo *UserMRepository) GetAllJoinedRoom(user models.User) []models.RoomMongo {
	var res models.UserMongo
	chatCollection := repo.Db.Database("chat").Collection("users")
	findFilter := bson.D{{"id", user.GetId()}}
	chatCollection.FindOne(context.TODO(), findFilter).Decode(&res)
	if res.Id == "" {
		repo.AddUser(user)
	}
	return res.Rooms
}

func (repo *UserMRepository) DeleteRoom(room models.Room, user models.User) {
	chatCollection := repo.Db.Database("chat").Collection("users")
	pullFilter := bson.D{{"id", user.GetId()}}
	pullBson := bson.D{{"$pull",
		bson.D{{
			"rooms", bson.D{{"id", room.GetId()}},
		}},
	}}
	chatCollection.UpdateOne(context.TODO(), pullFilter, pullBson)

}

// 사용자가 등록이 돼 있지 않다면 document 생성
func (repo *UserMRepository) AddUser(user models.User) {
	chatCollection := repo.Db.Database("chat").Collection("users")
	userInfo := models.UserMongo{
		Id:    user.GetId(),
		Name:  user.GetName(),
		Rooms: make([]models.RoomMongo, 0),
	}
	chatCollection.InsertOne(context.TODO(), userInfo)
}

func (repo *UserMRepository) AddRoom(room models.Room, user models.User) {
	chatCollection := repo.Db.Database("chat").Collection("users")
	findFilter := bson.D{{"id", user.GetId()}}
	check := chatCollection.FindOne(context.TODO(), findFilter)
	if check.Err() != nil {
		repo.AddUser(user)
	}

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
