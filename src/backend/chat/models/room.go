package models

import (
	"time"
)

type Room interface {
	GetId() string
	GetName() string
	GetPrivate() bool
}

type RoomRepository interface {
	AddRoom(room Room)
	FindRoomByName(name string) Room
	LoggingChat(chatLogData ChatLogData, content string)
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

type ChatLogData struct {
	SenderId       string    `bson:"sender_id"`
	SenderNickname string    `bson:"sender_nickname"`
	Content        string    `bson:"content"`
	SendTime       time.Time `bson:"send_time"`
}
