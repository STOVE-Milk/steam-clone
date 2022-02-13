package main

import (
	"encoding/json"
	"log"

	"github.com/STOVE-Milk/steam-clone/chat/models"
)

// 웹과 메세지를 교환을 정의하는 페이지 입니다.

const SendMessageAction = "send-message"
const UserJoinedAction = "user-join"
const UserLeftAction = "user-left"
const JoinRoomPrivateAction = "join-room-private"
const JoinRoomAction = "join-room"
const LeaveRoomAction = "leave-room"
const RoomJoinedAction = "room-joined"
const RoomViewAction = "room-view"
const RoomGetAction = "room-get"
const GetRoomListAction = "get-room-list"
const JoinRoomPublicAction = "join-room-public"

type Message struct {
	Action  string      `json:"action"`  // 웹측 및 서버측의 요청 정보를 담습니다.
	Message string      `json:"message"` // 요청에 대한 메세지를 담습니다.
	Target  *Room       `json:"target"`  // 요청의 타겟(룸 정보)를 담습니다.
	Sender  models.User `json:"sender"`  // 요청을 보낸 클라이언트의 정보를 담습니다.
	Data    interface{} `json:"data"`    // 요청 및 응답에서 필요한 객체를 담습니다.
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
