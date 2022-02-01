var app = new Vue({
  el: '#app',
  data: {
    ws: null,
    serverUrl: "ws://" + "localhost:8080" + "/chat/ws",
    roomInput: null,
    rooms: [],
    user: {
      name: ""
    },
    users: [],
    initialReconnectDelay: 1000,
    currentReconnectDelay: 0,
    maxReconnectDelay: 16000
  },
  mounted: function () {
  },
  methods: {
    connect() {
      this.connectToWebsocket();
    },
    connectToWebsocket() {
      console.log(this.serverUrl)
      this.ws = new WebSocket("ws://localhost:8080/chat/ws" + "?name=" + this.user.name);
      this.ws.addEventListener('open', (event) => { this.onWebsocketOpen(event) });
      this.ws.addEventListener('message', (event) => { this.handleNewMessage(event) });
      this.ws.addEventListener('close', (event) => { this.onWebsocketClose(event) });
    },
    onWebsocketOpen() {
      console.log("connected to WS!");
      this.currentReconnectDelay = 1000;
    },

    onWebsocketClose() {
      this.ws = null;

      setTimeout(() => {
        this.reconnectToWebsocket();
      }, this.currentReconnectDelay);

    },

    reconnectToWebsocket() {
      if (this.currentReconnectDelay < this.maxReconnectDelay) {
        this.currentReconnectDelay *= 2;
      }
      this.connectToWebsocket();
    },

    handleNewMessage(event) {
      let data = event.data;
      data = data.split(/\r?\n/);
      
      for (let i = 0; i < data.length; i++) {
        let msg = JSON.parse(data[i]);
        switch (msg.action) {
          case "send-message":
            this.handleChatMessage(msg);
            break;
          case "user-join":
            this.handleUserJoined(msg);
            break;
          case "user-left":
            this.handleUserLeft(msg);
            break;
          case "room-joined":
            this.handleRoomJoined(msg);
            break;
          default:
            break;
        }

      }
    },
    handleChatMessage(msg) {
      const room = this.findRoom(msg.target.id);
      if (typeof room !== "undefined") {
        room.messages.push(msg);
      }
    },
    handleUserJoined(msg) {
      this.users.push(msg.sender);
    },
    handleUserLeft(msg) {
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id == msg.sender.id) {
          this.users.splice(i, 1);
        }
      }
    },
    handleRoomJoined(msg) {
      room = msg.target;
      room.name = room.private ? msg.sender.name : room.name;
      room["messages"] = [];
      this.rooms.push(room);
    },
    sendMessage(room) {
      if (room.newMessage !== "") {
        this.ws.send(JSON.stringify({
          action: 'send-message',
          message: room.newMessage,
          target: {
            id: room.id,
            name: room.name
          }
        }));
        room.newMessage = "";
      }
    },
    findRoom(roomId) {
      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].id === roomId) {
          return this.rooms[i];
        }
      }
    },
    joinRoom() {
      this.ws.send(JSON.stringify({ action: 'join-room', message: this.roomInput }));
      this.roomInput = "";
    },
    leaveRoom(room) {
      this.ws.send(JSON.stringify({ action: 'leave-room', message: room.id }));

      for (let i = 0; i < this.rooms.length; i++) {
        if (this.rooms[i].id === room.id) {
          this.rooms.splice(i, 1);
          break;
        }
      }
    },
    joinPrivateRoom(room) {
      this.ws.send(JSON.stringify({ action: 'join-room-private', message: room.id }));
    }
  }
})