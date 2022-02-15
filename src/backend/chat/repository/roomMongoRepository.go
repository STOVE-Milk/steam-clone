package repository

import (
	"context"
	"fmt"
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

type RoomMRepository struct {
	Db *mongo.Client
}

// 방이 존재하지 않으면 방 생성.
func (repo *RoomMRepository) AddRoom(room models.Room) {
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

func (repo *RoomMRepository) LoggingChat(chatLogData models.ChatLogData, roomId string) {
	chatCollection := repo.Db.Database("chat").Collection("rooms")
	updateFilter := bson.D{{"id", roomId}}
	updateBson := bson.D{{"$push", bson.D{{"chat_log", chatLogData}}}}
	chatCollection.UpdateOne(context.TODO(), updateFilter, updateBson)

}

func (repo *RoomMRepository) GetRoomViewData(roomId string) models.RoomViewData {
	var roomViewData models.RoomViewData
	chatCollection := repo.Db.Database("chat").Collection("rooms")
	findFilter := bson.D{{"id", roomId}}
	err := chatCollection.FindOne(context.TODO(), findFilter).Decode(&roomViewData)
	if err != nil {
		fmt.Println(err)
	}
	return roomViewData
}

func (repo *RoomMRepository) FindRoomById(id string) models.Room {
	var room Room
	// var logList []models.ChatLogData
	chatCollection := repo.Db.Database("chat").Collection("rooms")
	findFilter := bson.D{{"id", id}}
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

func (repo *RoomMRepository) FindRoomByName(name string) models.Room {
	var room Room
	// var logList []models.ChatLogData
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

func (repo *RoomMRepository) AddMembers(room models.Room, members []string) {
	chatCollection := repo.Db.Database("chat").Collection("rooms")
	updateFilter := bson.D{{"id", room.GetId()}}
	updateBson := bson.D{{"$push", bson.D{{"members", bson.D{{"$each", members}}}}}}
	chatCollection.UpdateOne(context.TODO(), updateFilter, updateBson)
}

func (repo *RoomMRepository) DeleteMember(room models.Room, userId string) {
	chatCollection := repo.Db.Database("chat").Collection("rooms")
	pullFilter := bson.D{{"id", room.GetId()}}
	pullBson := bson.D{{"$pull",
		bson.D{{
			"members", userId,
		}},
	}}
	chatCollection.UpdateOne(context.TODO(), pullFilter, pullBson)
}
