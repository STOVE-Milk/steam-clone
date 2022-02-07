package main

import (
	"encoding/json"
	"log"
	"time"

	"github.com/STOVE-Milk/steam-clone/chat/config"
	"github.com/STOVE-Milk/steam-clone/chat/models"
)

const PubSubGeneralChannel = "general"

type WsServer struct {
	clients        map[*Client]bool // 클라이언트 저장
	register       chan *Client     // 클라이언트 등록
	unregister     chan *Client     // 클라이언트 제거
	rooms          map[*Room]bool   // 룸 기록
	broadcast      chan []byte      // 대화
	users          []models.User    // db에 등록된 유저 읽어 오기
	roomRepository models.RoomRepository
	userRepository models.UserRepository
}

func NewWebsocketServer(roomRepository models.RoomRepository, userRepository models.UserRepository) *WsServer {
	wsServer := &WsServer{
		clients:        make(map[*Client]bool),
		register:       make(chan *Client),
		unregister:     make(chan *Client),
		rooms:          make(map[*Room]bool),
		roomRepository: roomRepository,
		userRepository: userRepository,
	}

	// Add users from database to server
	wsServer.users = userRepository.GetAllUsers()

	return wsServer
}
func (server *WsServer) Run() {
	go server.listenPubSubChannel()
	for {
		select {
		case client := <-server.register:
			server.registerClient(client)

		case client := <-server.unregister:
			server.unregisterClient(client)

		case message := <-server.broadcast:
			server.broadcastToClients(message)

		}
	}
}

func (server *WsServer) registerClient(client *Client) {
	server.listOnlineClients(client)

	// Publish user in PubSub
	server.publishClientJoined(client)

	server.clients[client] = true
}

func (server *WsServer) unregisterClient(client *Client) {
	if _, ok := server.clients[client]; ok {
		delete(server.clients, client)

		// Publish user left in PubSub
		server.publishClientLeft(client)
	}
}

func (server *WsServer) publishClientJoined(client *Client) {

	message := &Message{
		Action: UserJoinedAction,
		Sender: client,
	}

	if err := config.Redis.Publish(ctx, PubSubGeneralChannel, message.encode()).Err(); err != nil {
		log.Println(err)
	}
}

func (server *WsServer) publishClientLeft(client *Client) {

	message := &Message{
		Action: UserLeftAction,
		Sender: client,
	}

	if err := config.Redis.Publish(ctx, PubSubGeneralChannel, message.encode()).Err(); err != nil {
		log.Println(err)
	}
}

func (server *WsServer) listenPubSubChannel() {

	pubsub := config.Redis.Subscribe(ctx, PubSubGeneralChannel)
	ch := pubsub.Channel()
	for msg := range ch {

		var message Message
		if err := json.Unmarshal([]byte(msg.Payload), &message); err != nil {
			log.Printf("Error on unmarshal JSON message %s", err)
			return
		}

		switch message.Action {
		case UserJoinedAction:
			server.handleUserJoined(message)
		case UserLeftAction:
			server.handleUserLeft(message)
		case JoinRoomPrivateAction:
			server.handleUserJoinPrivate(message)
		}
	}
}

func (server *WsServer) handleUserJoinPrivate(message Message) {
	// Find client for given user, if found add the user to the room.
	targetClient := server.findClientByID(message.Message)
	if targetClient != nil {
		targetClient.joinRoom(message.Target.GetName(), message.Sender)
	}
}
func (server *WsServer) findUserByID(ID string) models.User {
	var foundUser models.User
	for _, client := range server.users {
		if string(client.GetId()) == ID {
			foundUser = client
			break
		}
	}

	return foundUser
}
func (server *WsServer) handleUserJoined(message Message) {
	// Add the user to the slice
	server.broadcastToClients(message.encode())
}

func (server *WsServer) handleUserLeft(message Message) {

	server.broadcastToClients(message.encode())
}

//해당 클라이언트에게 접속 중인 클라이언트들의 정보를 줌.
func (server *WsServer) listOnlineClients(client *Client) {
	// NEW: Use the users slice instead of the client map
	for _, user := range server.users {
		message := &Message{
			Action: UserJoinedAction,
			Sender: user,
		}
		client.send <- message.encode()
	}
}

// 서버에 등록된 클라이언트들에게 메세지를 전송.
// 누군가 웹 소켓 연결을 할 때나 연결을 끊을 때.
func (server *WsServer) broadcastToClients(message []byte) {
	for client := range server.clients {
		client.send <- message
	}
}

func (server *WsServer) findRoomByName(name string) *Room {
	var foundRoom *Room
	for room := range server.rooms {
		if room.GetName() == name {
			foundRoom = room
			break
		}
	}

	// NEW: if there is no room, try to create it from the repo
	if foundRoom == nil {
		// Try to run the room from the repository, if it is found.
		foundRoom = server.runRoomFromRepository(name)
	}

	return foundRoom
}

func (server *WsServer) runRoomFromRepository(name string) *Room {
	var room *Room
	dbRoom := server.roomRepository.FindRoomByName(name)
	if dbRoom != nil {
		room = NewRoom(dbRoom.GetName(), dbRoom.GetPrivate())
		room.ID = dbRoom.GetId()

		go room.RunRoom()
		server.rooms[room] = true
	}

	return room
}

func (server *WsServer) findClientByID(ID string) *Client {
	var foundClient *Client
	for client := range server.clients {
		if client.ID == ID {
			foundClient = client
			break
		}
	}

	return foundClient
}

func (server *WsServer) findRoomByID(ID string) *Room {
	var foundRoom *Room
	for room := range server.rooms {
		if room.GetId() == ID {
			foundRoom = room
			break
		}
	}

	return foundRoom
}

func (server *WsServer) createRoom(name string, private bool) *Room {
	room := NewRoom(name, private)

	server.roomRepository.AddRoom(room)
	go room.RunRoom()
	server.rooms[room] = true

	return room
}

func (server *WsServer) loggingChat(roomId, senderId, senderNickname, content string) {
	chatLogData := models.ChatLogData{
		SenderId:       senderId,
		SenderNickname: senderNickname,
		Content:        content,
		SendTime:       time.Now(),
	}
	server.roomRepository.LoggingChat(chatLogData, roomId)
}
