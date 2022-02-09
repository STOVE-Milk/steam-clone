package main

import (
	"encoding/json"
	"log"

	"github.com/STOVE-Milk/steam-clone/chat/models"
)

const SendMessageAction = "send-message"
const UserJoinedAction = "user-join"
const UserLeftAction = "user-left"
const JoinRoomPrivateAction = "join-room-private"
const JoinRoomAction = "join-room"
const LeaveRoomAction = "leave-room"
const RoomJoinedAction = "room-joined"
const RoomViewAction = "room-view"
const GetRoomListAction = "get-room-list"
const JoinRoomPublicAction = "join-room-public"

type Message struct {
	Action  string      `json:"action"`
	Message string      `json:"message"`
	Target  *Room       `json:"target"`
	Sender  models.User `json:"sender"`
	Data    interface{} `json:"data"`
}

func (message *Message) encode() []byte {
	json, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	return json
}

func (message *Message) UnmarshalJSON(data []byte) error {
	type Alias Message
	msg := &struct {
		Sender Client `json:"sender"`
		*Alias
	}{
		Alias: (*Alias)(message),
	}
	if err := json.Unmarshal(data, &msg); err != nil {

		return err
	}
	message.Sender = &msg.Sender
	return nil
}
