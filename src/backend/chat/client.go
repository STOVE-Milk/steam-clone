package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/STOVE-Milk/steam-clone/chat/config"
	"github.com/STOVE-Milk/steam-clone/chat/models"
	"github.com/gorilla/websocket"
)

// 클라이언트를 생성하고 다룹니다.
// 클라이언트가 요청한 메세지가 웹 소캣 서버, 룸의 도움을 받아야 한다면 그들의 함수를 호출합니다.
// 이들은 채팅방에 대해 참여 요청, 탈퇴 요청을 할 수 있으며 채팅 메세지를 보낼 수 있습니다.
// 또한 채팅방에 대한 정보를 받아 올 수 있고 친구를 채팅방에 초대할 수 있습니다.
//
// TODO
// 현재는 초대가 방을 생성할 때 밖에 되지 않습니다. 이후 방이 만들어 진 후에도 초대가 가능하도록 기능을 추가할 예정입니다.

const (
	writeWait = 10 * time.Second

	// 응답 대기 시간
	pongWait = 60 * time.Second

	// 웹 소켓 연결을 유지시킬 핑 메세지, 응답 대기시간보다 짧아야함.
	pingPeriod = (pongWait * 9) / 10

	// 웹 소켓 사이의 전송 메세지 최댓 값.
	maxMessageSize = 10000
)

var (
	newline = []byte{'\n'}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// 웹 소켓 서버에 등록 될 클라이언트
type Client struct {
	conn     *websocket.Conn
	wsServer *WsServer
	send     chan []byte
	ID       string `json:"id"`
	Name     string `json:"name"`
	Profile  string `json:"profile"`
	friends  map[string]models.User
	rooms    map[*Room]bool
}

// DB에 등록된 클라이언트을 웹 서버에 등록
func newClient(conn *websocket.Conn, wsServer *WsServer, user models.User) *Client {
	client := &Client{
		ID:       user.GetId(),
		Name:     user.GetName(),
		conn:     conn,
		wsServer: wsServer,
		send:     make(chan []byte, 256),
		rooms:    make(map[*Room]bool),
	}
	client.friends = wsServer.getFriends(user.GetId())
	client.Profile = wsServer.userRepository.FindUserById(user.GetId()).GetProfile()
	return client

}

func (client *Client) readPump() {
	defer func() {
		client.disconnect()
	}()

	client.conn.SetReadLimit(maxMessageSize)
	client.conn.SetReadDeadline(time.Now().Add(pongWait))
	client.conn.SetPongHandler(func(string) error { client.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	// 클라이언트의 메세지를 클라이언트의 접속이 끊길 때 까지 확인.
	for {
		_, jsonMessage, err := client.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("unexpected close error: %v", err)
			}
			break
		}
		client.handleNewMessage(jsonMessage)
		fmt.Println("클라이언트 : " + string(jsonMessage))
	}

}

func (client *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		client.conn.Close()
	}()
	for {
		select {
		case message, ok := <-client.send:
			client.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The WsServer closed the channel.
				client.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := client.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(client.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-client.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			client.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := client.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (client *Client) disconnect() {
	//가입된 방을 가져온다.
	//가입된 방에 client가 등록 돼 있으면 제거한다.
	client.wsServer.unregister <- client
	close(client.send)
	client.conn.Close()
}

// wsServer는 클라이언트의 웹서버에 대한 요청을 처리
func ServeWs(wsServer *WsServer, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	var user models.User
	// 토큰에서 유저의 정보를 가져옴
	loginUser, _ := models.ExtractMetadata(r)
	user = &Client{
		ID:   string(loginUser.UserId),
		Name: loginUser.Nickname,
	}
	wsServer.setUser(user)

	client := newClient(conn, wsServer, user)

	go client.writePump()
	go client.readPump()

	wsServer.register <- client

}

// 클라이언트의 메세지를 처리하는 thread 실행
func (client *Client) handleNewMessage(jsonMessage []byte) {

	var message Message
	if err := json.Unmarshal(jsonMessage, &message); err != nil {
		log.Printf("Error on unmarshal JSON message %s", err)
		return
	}

	message.Sender = client
	switch message.Action {
	case SendMessageAction:
		roomID := message.Target.GetId()
		if room := client.wsServer.findRoomByID(roomID); room != nil {
			room.broadcast <- &message
		}
		client.wsServer.loggingChat(roomID, message.Sender, message.Message)

	case JoinRoomPublicAction:
		client.handleJoinRoomMessage(message)

	case LeaveRoomAction:
		client.handleLeaveRoomMessage(message)

	case JoinRoomPrivateAction:
		client.handleJoinRoomPrivateMessage(message)

	case RoomViewAction:
		client.handleRoomViewMessage(message)

	case RoomGetAction:
		client.handleRoomGetAction(message)
	}

}

func (client *Client) handleRoomGetAction(message Message) {
	rooms := client.wsServer.getAllJoinedRoom(client)

	message = Message{
		Action: RoomGetAction,
		Data:   rooms,
	}
	client.send <- message.encode()
}

// 채팅 방을 클릭하면 채팅방의 정보를 보여 줌.
func (client *Client) handleRoomViewMessage(message Message) {
	room := client.wsServer.findRoomByID(message.Target.ID)
	// 채팅 방을 클릭했을 때 그 방에
	if !client.isInRoom(room) {
		client.rooms[room] = true
		room.register <- client
	}

	data := client.wsServer.getRoomViewData(room.GetId())
	message = Message{
		Action: RoomViewAction,
		Target: room,
		Data:   data,
	}
	client.send <- message.encode()
}

func (client *Client) handleLeaveRoomMessage(message Message) {
	room := client.wsServer.findRoomByID(message.Message)
	if room == nil {
		return
	}

	if _, ok := client.rooms[room]; ok {
		delete(client.rooms, room)
	}
	client.wsServer.deleteRoom(room, client)
	client.wsServer.deleteMember(room, client)

	room.unregister <- client
}

func (client *Client) handleJoinRoomPrivateMessage(message Message) {
	target := client.wsServer.findUserByID(message.Message)

	// 1:1 대화에 참여하는 유저 아이디를 오름차순 소팅하여 룸 이름으로 사용.
	userA, _ := strconv.Atoi(message.Message)
	userB, _ := strconv.Atoi(client.ID)
	if userA > userB {
		userA, userB = userB, userA
	}
	roomName := fmt.Sprintf("%v-%v", userA, userB)

	members := []models.User{client, client.friends[message.Message]}

	// Join room
	joinedRoom := client.joinRoom("", roomName, client, members)

	// 접속 중인 회원이 아니라면 방 까지만 만들고 상대방에게 방을 보이게 할 필요는 없다.
	if target == nil {
		return
	}

	// Invite target user
	if joinedRoom != nil {
		client.invitePrivateRoom(target, joinedRoom)
	}

}

func (client *Client) handleJoinRoomMessage(message Message) { //메세지밖에엄슴
	var members []models.User
	strArr := strings.Split(message.Message, "-") // strArr[0] = 방 이름, strArr[1] = 초대한 사람, strArr[2~n] = 초대 받은 사람
	roomName := strArr[0]
	friends := strArr[2:]
	members = append(members, client)
	for _, friend := range friends {
		members = append(members, client.friends[friend])
	}
	joinedRoom := client.joinRoom("public", roomName, nil, members)
	if joinedRoom != nil {
		client.invitePublicRoom(members, joinedRoom)
	}

}

func (client *Client) joinRoom(roomId, roomName string, sender models.User, members []models.User) *Room {

	var room *Room
	if roomId == "" {
		//그룹 채팅방
		room = client.wsServer.findRoomByName(roomName)
	} else {
		//1:1 채팅방
		room = client.wsServer.findRoomByID(roomId)
	}
	if room == nil {
		room = client.wsServer.createRoom(roomName, sender != nil, members)
	}

	if sender == nil && room.Private {
		return nil
	}
	if !client.isInRoom(room) {

		client.rooms[room] = true
		room.register <- client
		client.notifyRoomJoined(room, sender)
	}
	return room

}

func (client *Client) isInRoom(room *Room) bool {
	if _, ok := client.rooms[room]; ok {
		return true
	}

	return false
}

func (client *Client) invitePrivateRoom(target models.User, room *Room) {
	inviteMessage := &Message{
		Action:  JoinRoomPrivateAction,
		Message: string(target.GetId()),
		Target:  room,
		Sender:  client,
	}
	if err := config.Redis.Publish(ctx, PubSubGeneralChannel, inviteMessage.encode()).Err(); err != nil {
		log.Println(err)
	}
}

func (client *Client) invitePublicRoom(members []models.User, room *Room) {
	for _, member := range members {
		inviteMessage := &Message{
			Action:  JoinRoomPublicAction,
			Message: member.GetId(),
			Target:  room,
			Sender:  client,
		}

		if err := config.Redis.Publish(ctx, PubSubGeneralChannel, inviteMessage.encode()).Err(); err != nil {
			log.Println(err)
		}
	}

}

func (client *Client) notifyRoomJoined(room *Room, sender models.User) {
	message := Message{
		Action: RoomJoinedAction,
		Target: room,
		Sender: sender,
	}
	client.send <- message.encode()
}

func (client *Client) GetId() string {
	return client.ID
}

func (client *Client) GetName() string {
	return client.Name
}

func (client *Client) GetProfile() string {
	return client.Profile
}
