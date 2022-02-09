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

const (
	// Max wait time when writing message to peer
	writeWait = 10 * time.Second

	// Max time till next pong from peer
	pongWait = 60 * time.Second

	// Send ping interval, must be less then pong wait time
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 10000
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// Client represents the websocket client at the server
type Client struct {
	// The actual websocket connection.
	conn     *websocket.Conn
	wsServer *WsServer
	send     chan []byte
	ID       string `json:"id"`
	Name     string `json:"name"`
	rooms    map[*Room]bool
}

func newClient(conn *websocket.Conn, wsServer *WsServer, user models.User) *Client {
	return &Client{
		ID:       user.GetId(),
		Name:     user.GetName(),
		conn:     conn,
		wsServer: wsServer,
		send:     make(chan []byte, 256),
		rooms:    make(map[*Room]bool),
	}

}

func (client *Client) readPump() {
	defer func() {
		client.disconnect()
	}()

	client.conn.SetReadLimit(maxMessageSize)
	client.conn.SetReadDeadline(time.Now().Add(pongWait))
	client.conn.SetPongHandler(func(string) error { client.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	// Start endless read loop, waiting for messages from client
	for {
		_, jsonMessage, err := client.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("unexpected close error: %v", err)
			}
			break
		}

		client.handleNewMessage(jsonMessage)
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

			// Attach queued chat messages to the current websocket message.
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
	client.wsServer.unregister <- client

	close(client.send)
	client.conn.Close()
}

// ServeWs handles websocket requests from clients requests.
func ServeWs(wsServer *WsServer, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	var user models.User
	loginUser, _ := models.ExtractMetadata(r)
	for _, u := range wsServer.users {
		if u.GetName() == loginUser.Nickname {
			user = u
			break
		}
	}
	client := newClient(conn, wsServer, user)

	go client.writePump()
	go client.readPump()

	wsServer.register <- client

}

func (client *Client) handleNewMessage(jsonMessage []byte) {

	var message Message
	if err := json.Unmarshal(jsonMessage, &message); err != nil {
		log.Printf("Error on unmarshal JSON message %s", err)
		return
	}
	fmt.Println("클라이언트 : " + string(message.encode()))

	message.Sender = client
	switch message.Action {
	case SendMessageAction:
		roomID := message.Target.GetId()
		if room := client.wsServer.findRoomByID(roomID); room != nil {
			room.broadcast <- &message
		}
		client.wsServer.loggingChat(roomID, message.Sender.GetId(), message.Sender.GetName(), message.Message)

	case JoinRoomPublicAction:
		client.handleJoinRoomMessage(message)

	case LeaveRoomAction:
		client.handleLeaveRoomMessage(message)

	case JoinRoomPrivateAction:
		client.handleJoinRoomPrivateMessage(message)

	case RoomViewAction:
		client.handleRoomViewMessage(message)
	}

}

func (client *Client) handleRoomViewMessage(message Message) {
	roomId := message.Target.ID
	data := client.wsServer.getRoomViewData(roomId)
	message = Message{
		Action: RoomViewAction,
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

	room.unregister <- client
}

func (client *Client) handleJoinRoomPrivateMessage(message Message) {
	target := client.wsServer.findUserByID(message.Message)

	if target == nil {
		return
	}

	// create unique room name combined to the two IDs
	userA, _ := strconv.Atoi(message.Message)
	userB, _ := strconv.Atoi(client.ID)
	if userA > userB {
		userA, userB = userB, userA
	}
	roomName := fmt.Sprintf("%v-%v", userA, userB)

	// Join room
	joinedRoom := client.joinRoom(roomName, target, []string{client.ID, message.Message})
	// Invite target user
	if joinedRoom != nil {
		client.invitePrivateRoom(target, joinedRoom)
	}

}

func (client *Client) handleJoinRoomMessage(message Message) {

	strArr := strings.Split(message.Message, "-") // strArr[0] = 방 이름, strArr[1] = 초대한 사람, strArr[2~n] = 초대 받은 사람
	roomName := strArr[0]
	members := strArr[1:]
	fmt.Println(members)
	joinedRoom := client.joinRoom(roomName, nil, members)
	if joinedRoom != nil {
		client.invitePublicRoom(members, joinedRoom)
	}

}

func (client *Client) joinRoom(roomName string, sender models.User, members []string) *Room {
	room := client.wsServer.findRoomByName(roomName)
	if room == nil {
		room = client.wsServer.createRoom(roomName, sender != nil)
		client.wsServer.addMembers(room, members)
	}

	// Don't allow to join private rooms through public room message
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

func (client *Client) invitePublicRoom(members []string, room *Room) {
	for _, member := range members {
		inviteMessage := &Message{
			Action:  JoinRoomPublicAction,
			Message: member,
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
