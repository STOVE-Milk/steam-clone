package models

import (
	"time"

	"github.com/google/uuid"
)

type Room interface {
	GetId() string
	GetName() string
	GetPrivate() bool
}

type RoomRepository interface {
	AddRoom(room Room)
	FindRoomByName(name string) Room
}
type RoomsMongo struct {
	ID        uuid.UUID `bson:"id"`
	Name      string    `bosn:"name"`
	No        int32     `bson:"no"`
	Private   bool      `bson:"private"`
	Memebers  []int32   `bson:"members"`
	Amount    int64     `bson:"amount"`
	CreatedAt time.Time `bson:"created_at"`
}

type MessageMongo struct {
	Sender   int32     `bson:"sender"`
	Body     string    `bson:"body"`
	SendTime time.Time `bson:"send_time"`
}
