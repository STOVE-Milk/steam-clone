package main

import (
	"fmt"
	"log"

	"github.com/STOVE-Milk/steam-clone/chat/config"
	uuid "github.com/google/uuid"
)

const goodbyeMessage = "%s leave the room"

type Room struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Private    bool   `json:"private"`
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan *Message
}

// NewRoom creates a new Room
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

// RunRoom runs our room, accepting various requests
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

// 초대하는 함수에 포함되어야함.
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
	err := config.Redis.Publish(ctx, room.GetName(), message).Err()
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

	room.publishRoomMessage(message.encode())
}

func (room *Room) subscribeToRoomMessages() {
	pubsub := config.Redis.Subscribe(ctx, room.GetName())

	ch := pubsub.Channel()

	for msg := range ch {
		room.broadcastToClientsInRoom([]byte(msg.Payload))
	}
}

// 한명이 초대하는 것으로 구현할 것이기 때문에 필요 없음.
// func (room *Room) notifyClientJoined(client *Client) {
// 	message := &Message{
// 		Action:  SendMessageAction,
// 		Target:  room,
// 		Message: fmt.Sprintf(welcomeMessage, client.GetName()),
// 	}

// 	room.publishRoomMessage(message.encode())
// }

func (room *Room) GetId() string {
	return room.ID
}

func (room *Room) GetName() string {
	return room.Name
}

func (room *Room) GetPrivate() bool {
	return room.Private
}