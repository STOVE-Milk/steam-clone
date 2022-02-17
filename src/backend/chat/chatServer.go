package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/STOVE-Milk/steam-clone/chat/config"
	"github.com/STOVE-Milk/steam-clone/chat/models"
)

// 웹 소캣 서버입니다.
// 웹 소캣 서버에서 클라이언트와 채팅방을 등록합니다.
// 웹 소캣 서버는 기본적으로 general 채널을 구독합니다.
// general 채널을 활용하여 다른 인스턴스에 있는 클라이언트를 확인하여 채팅방을 개설하여 채팅에 참여할 수 있게 하며
// 로그인 시 무조건 적으로 웹 소캣 서버에 클라이언트를 등록하는 특성을 활용하여 상태관리를 진행합니다.
//
// TODO
// 현재는 동시성과 관련된 이슈를 처리하지 않은 상태입니다. race이슈와 같은 동시성에서 생길 수 있는 이슈를 처리할 예정입니다.
// 현재는 친구가 아닌 클라이언트가 웹 소캣 서버에 등록 될 때에도 그에 대한 등록 메세지를 받습니다. 친구의 커넥션과 디스커넥션 데이터만 받도록 수정할 예정입니다.

const PubSubGeneralChannel = "general"

type WsServer struct {
	clients         map[*Client]bool // 클라이언트 저장
	register        chan *Client     // 클라이언트 등록
	unregister      chan *Client     // 클라이언트 제거
	rooms           map[*Room]bool   // 룸 저장
	users           map[string]models.User
	roomMRepository models.RoomRepository
	userMRepository models.UserMRepository
	userRepository  models.UserRepository
}

func NewWebsocketServer(roomMRepository models.RoomRepository, userMRepository models.UserMRepository, userRepository models.UserRepository) *WsServer {
	wsServer := &WsServer{
		clients:         make(map[*Client]bool),
		register:        make(chan *Client),
		unregister:      make(chan *Client),
		rooms:           make(map[*Room]bool),
		users:           make(map[string]models.User),
		roomMRepository: roomMRepository,
		userMRepository: userMRepository,
		userRepository:  userRepository,
	}

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
		}
	}
}

// 클라이언트를 서버에 등록하는 로직
func (server *WsServer) registerClient(client *Client) {

	server.listOnlineClients(client)
	server.publishClientJoined(client)
	server.clients[client] = true

}

func (server *WsServer) unregisterClient(client *Client) {
	if _, ok := server.clients[client]; ok {

		// 룸에서 클라이언트의 메모리 제거
		for room, _ := range client.rooms {

			if _, ok := server.rooms[room]; ok {
				delete(room.clients, client)

				// 클라이언트가 없는 룸은 웹 소켓 서버에서 제거
				if len(room.clients) == 0 {
					delete(server.rooms, room)
				}

			}
		}

		// 서버에서 클라이언트 메모리 제거
		delete(server.clients, client)

		server.publishClientLeft(client)
	}
}

func (server *WsServer) publishClientJoined(client *Client) {
	message := &Message{
		Action: UserJoinedAction,
		Sender: client,
		Data:   client.friends,
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

// 웹 소캣 서버가 생성되면 general 채널을 구독
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
		case JoinRoomPublicAction:
			server.handleUserJoinPublic(message)

		}
		fmt.Println("서버 : " + string(message.encode()))

	}
}

// 클라이언트가 이 웹 소캣 서버에 존재한다면 그룹 방 참여
func (server *WsServer) handleUserJoinPublic(message Message) {
	fmt.Println(string(message.encode()))
	targetClient := server.findClientByID(message.Message)
	if targetClient != nil {
		targetClient.joinRoom(message.Target.ID, message.Target.GetName(), message.Sender, nil)
	}
}

// 1:1방 참여
func (server *WsServer) handleUserJoinPrivate(message Message) {
	fmt.Println(string(message.encode()))
	targetClient := server.findClientByID(message.Message)
	if targetClient != nil {
		targetClient.joinRoom(message.Target.ID, message.Target.GetName(), message.Sender, nil)
	}
}

func (server *WsServer) findUserByID(ID string) models.User {
	var foundUser models.User
	if _, ok := server.users[ID]; ok {
		foundUser = server.users[ID]
	}

	return foundUser
}
func (server *WsServer) handleUserJoined(message Message) {

	friends := server.getUserFriends(message.Sender.GetId())
	clients := server.friendsToClient(friends)
	message.Data = nil
	server.users[message.Sender.GetId()] = message.Sender
	server.noticeToFriends(message.encode(), clients)
}

func (server *WsServer) handleUserLeft(message Message) {

	friends := server.getUserFriends(message.Sender.GetId())
	clients := server.friendsToClient(friends)
	message.Data = nil
	server.users[message.Sender.GetId()] = message.Sender
	delete(server.users, message.Sender.GetId())
	server.noticeToFriends(message.encode(), clients)
}

//해당 클라이언트에게 접속 중인 클라이언트들의 정보를 줌.
func (server *WsServer) listOnlineClients(client *Client) {

	for _, user := range client.friends {
		if _, ok := server.users[user.GetId()]; ok {
			message := &Message{
				Action: UserJoinedAction,
				Sender: user,
			}
			client.send <- message.encode()
		}

	}
}

// 서버에 등록된 클라이언트들에게 메세지를 전송.
// 클라이언트가 웹 소켓을 연결할 때나 연결을 끊을 때.
func (server *WsServer) noticeToFriends(message []byte, friends []*Client) {
	for _, client := range friends {
		if _, ok := server.clients[client]; ok {
			client.send <- message
		}
	}
}

func (server *WsServer) getRoomViewData(roomId string) models.RoomViewData {
	roomViewData := server.roomMRepository.GetRoomViewData(roomId)

	return roomViewData
}

// 이름으로 룸을 검색 후 웹 소캣 서버에 등록돼 있지 않다면 등록 후 thread 실행
func (server *WsServer) findRoomByName(name string) *Room {
	var foundRoom *Room
	for room := range server.rooms {
		if room.GetName() == name {
			foundRoom = room
			break
		}
	}

	if foundRoom == nil {
		foundRoom = server.runRoomFromRepository("", name)
	}
	return foundRoom
}
func (server *WsServer) findRoomByID(id string) *Room {
	var foundRoom *Room
	for room := range server.rooms {
		if room.GetId() == id {
			foundRoom = room
			break
		}
	}
	if foundRoom == nil {
		foundRoom = server.runRoomFromRepository(id, "")
	}

	return foundRoom
}

// 만약 방이 웹 소캣 서버에 등록돼 있지 않다면 등록 후 thread 등록
func (server *WsServer) runRoomFromRepository(id, name string) *Room {
	var room *Room
	var dbRoom models.Room
	if id == "" {
		dbRoom = server.roomMRepository.FindRoomByName(name)
	} else {
		dbRoom = server.roomMRepository.FindRoomById(id)
	}
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

// 새로운 룸 생성
func (server *WsServer) createRoom(name string, private bool, members []string) *Room {
	room := NewRoom(name, private)
	// MongoDB에 룸 정보 저장
	server.roomMRepository.AddRoom(room)
	// MongoDB에 채팅에 참여하는 members 정보 저장
	server.roomMRepository.AddMembers(room, members)
	// MongoDB에 user 마다 참여한 룸 정보 저장.
	for _, member := range members {
		server.userMRepository.AddRoom(room, member)
	}
	go room.RunRoom()
	server.rooms[room] = true

	return room
}

func (server *WsServer) getAllJoinedRoom(client models.User) []models.RoomMongo {
	return server.userMRepository.GetAllJoinedRoom(client.GetId())
}

func (server *WsServer) getUserFriends(clientId string) []models.User {
	return server.userRepository.GetUserFriends(clientId)
}

func (server *WsServer) deleteMember(room models.Room, userId string) {
	server.roomMRepository.DeleteMember(room, userId)
}

func (server *WsServer) deleteRoom(room models.Room, userId string) {
	server.userMRepository.DeleteRoom(room, userId)
}

func (server *WsServer) loggingChat(roomId, senderId, senderNickname, content string) {
	chatLogData := models.ChatLogData{
		SenderId:       senderId,
		SenderNickname: senderNickname,
		Content:        content,
		SendTime:       time.Now(),
	}
	server.roomMRepository.LoggingChat(chatLogData, roomId)
}

func (server *WsServer) friendsToClient(friends []models.User) []*Client {
	var clients []*Client
	for _, friend := range friends {
		client := server.findClientByID(friend.GetId())
		clients = append(clients, client)
	}
	return clients
}
func (server *WsServer) setUser(user models.User) {
	server.users[user.GetId()] = user
}
