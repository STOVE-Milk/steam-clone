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
	AddMembers(room Room, members []User)
	DeleteMember(room Room, user User)
	FindRoomById(id string) Room
	FindRoomByName(name string) Room
	LoggingChat(chatLogData ChatLogData, roomId string)
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
	ID      string `bson:"id" json:"id"`
	Name    string `bosn:"name" json:"name"`
	Private bool   `bson:"private" json:"private"`
}
type ChatLogData struct {
	SenderId       string    `bson:"sender_id" json:"sender_id"`
	SenderNickname string    `bson:"sender_nickname" json:"sender_nickname"`
	SenderProfile  string    `bson:"sender_profile" json:"sender_profile"`
	Content        string    `bson:"content" json:"content"`
	SendTime       time.Time `bson:"send_time" json:"send_time"`
}

type RoomViewData struct {
	Members []UserMongo   `bson:"members" json:"members"`
	Log     []ChatLogData `bson:"chat_log" json:"log"`
}

func (data *RoomViewData) Encode() []byte {
	json, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}

	return json
}
