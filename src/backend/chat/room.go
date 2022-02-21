package main

import (
	"fmt"
	"log"

	"github.com/STOVE-Milk/steam-clone/chat/config"
	uuid "github.com/google/uuid"
)

// 룸을 생성하고 다룹니다.
// 룸이 생성 될 시 레디스에 룸의 이름으로 구독 신청을 합니다.
// 타겟 룸이 존재한다면 타겟 룸에 받은 채팅 메세지를 브로드캐스팅 합니다.
// 룸에 클라이언트를 등록합니다.

const goodbyeMessage = "%s 님이 채팅 방을 나갔습니다."

type Room struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Private    bool   `json:"private"`
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan *Message
}

func NewRoom(name string, private bool) *Room {
	return &Room{
		ID:         uuid.New().String(),
		Name:       name,
		Private:    private,
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan *Message),
	}
}

func (room *Room) RunRoom() {
	go room.subscribeToRoomMessages()

	for {
		select {

		case client := <-room.register:
			room.registerClientInRoom(client)

		case client := <-room.unregister:
			room.unregisterClientInRoom(client)

		case message := <-room.broadcast:
			room.publishRoomMessage(message.encode())
		}

	}
}

func (room *Room) registerClientInRoom(client *Client) {
	room.clients[client] = true
}

func (room *Room) unregisterClientInRoom(client *Client) {
	if _, ok := room.clients[client]; ok {
		delete(room.clients, client)
	}
	if !room.Private {
		room.notifyClientLeave(client)
	}
}

func (room *Room) broadcastToClientsInRoom(message []byte) {
	for client := range room.clients {
		client.send <- message
	}
}

func (room *Room) publishRoomMessage(message []byte) {
	err := config.Redis.Publish(ctx, room.GetId(), message).Err()
	if err != nil {
		log.Println(err)
	}
}

func (room *Room) notifyClientLeave(client *Client) {
	message := &Message{
		Action:  SendMessageAction,
		Target:  room,
		Message: fmt.Sprintf(goodbyeMessage, client.GetName()),
	}

	client.wsServer.loggingChat(room.ID, nil, fmt.Sprintf(goodbyeMessage, client.GetName()))

	room.publishRoomMessage(message.encode())
}

func (room *Room) subscribeToRoomMessages() {
	pubsub := config.Redis.Subscribe(ctx, room.GetId())

	ch := pubsub.Channel()

	for msg := range ch {
		room.broadcastToClientsInRoom([]byte(msg.Payload))
	}
}

func (room *Room) GetId() string {
	return room.ID
}

func (room *Room) GetName() string {
	return room.Name
}

func (room *Room) GetPrivate() bool {
	return room.Private
}
