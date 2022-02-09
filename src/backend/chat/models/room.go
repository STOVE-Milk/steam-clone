package models

import (
	"encoding/json"
	"log"
	"time"
)

type Room interface {
	GetId() string
	GetName() string
	GetPrivate() bool
}

type RoomRepository interface {
	AddRoom(room Room)
	AddMembers(room Room, members []string)
	FindRoomByName(name string) Room
	LoggingChat(chatLogData ChatLogData, content string)
	GetRoomViewData(roomId string) RoomViewData
}
type RoomsMongo struct {
	ID        string    `bson:"id"`
	Name      string    `bosn:"name"`
	No        int32     `bson:"no"`
	Private   bool      `bson:"private"`
	Memebers  []string  `bson:"members"`
	Amount    int64     `bson:"amount"`
	CreatedAt time.Time `bson:"created_at"`
}
type RoomMongo struct {
	ID      string `bson:"id"`
	Name    string `bosn:"name"`
	Private bool   `bson:"private"`
}
type ChatLogData struct {
	SenderId       string    `bson:"sender_id" json:"sender_id"`
	SenderNickname string    `bson:"sender_nickname" json:"sender_nickname"`
	Content        string    `bson:"content" json:"content"`
	SendTime       time.Time `bson:"send_time" json:"send_time"`
}

type RoomViewData struct {
	Members []int32       `bson:"members" json:"members"`
	Log     []ChatLogData `bson:"chat_log" json:"log"`
}

func (data *RoomViewData) Encode() []byte {
	json, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}

	return json
}
