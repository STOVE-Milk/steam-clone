package repository

import (
	"context"
	"time"

	"github.com/STOVE-Milk/steam-clone/chat/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type Room struct {
	Id      string
	Name    string
	Private bool
}

func (room *Room) GetId() string {
	return room.Id
}

func (room *Room) GetName() string {
	return room.Name
}

func (room *Room) GetPrivate() bool {
	return room.Private
}

type RoomRepository struct {
	Db *mongo.Client
}

// 방이 존재하지 않으면 방 생성.
func (repo *RoomRepository) AddRoom(room models.Room) {
	chatCollection := repo.Db.Database("chat").Collection("rooms")
	roomsInfo := models.RoomsMongo{
		ID:        room.GetId(),
		Name:      room.GetName(),
		No:        1,
		Private:   room.GetPrivate(),
		Memebers:  []string{},
		Amount:    1,
		CreatedAt: time.Now(),
	}

	chatCollection.InsertOne(context.TODO(), roomsInfo)
}

func (repo *RoomRepository) LoggingChat(chatLogData models.ChatLogData, roomId string) {
	chatCollection := repo.Db.Database("chat").Collection("rooms")
	updateFilter := bson.D{{"id", roomId}}
	updateBson := bson.D{{"$push",
		bson.D{{
			"chat_log", chatLogData,
		}},
	}}
	chatCollection.UpdateOne(context.TODO(), updateFilter, updateBson)

}

func (repo *RoomRepository) FindRoomByName(name string) models.Room {
	var room Room

	chatCollection := repo.Db.Database("chat").Collection("rooms")
	findFilter := bson.D{{"name", name}}
	var roomB bson.M
	chatCollection.FindOne(context.TODO(), findFilter).Decode(&roomB)

	if roomB == nil {
		return nil
	}
	room = Room{
		Id:      roomB["id"].(string),
		Name:    roomB["name"].(string),
		Private: roomB["private"].(bool),
	}
	return &room
}
