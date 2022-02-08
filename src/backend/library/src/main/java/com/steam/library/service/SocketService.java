package com.steam.library.service;

import com.steam.library.dto.Room;
import com.steam.library.global.common.Behavior;
import com.steam.library.global.common.UserDetails;
import com.steam.library.dto.messages.*;
import com.steam.library.global.error.ErrorCode;
import com.steam.library.global.util.JsonUtil;
import com.steam.library.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RequiredArgsConstructor
@Service
public class SocketService {
    // userId : sessionId
    private static Map<String, String> user_session = new ConcurrentHashMap<>();
    // sessionId : UserDetails
    private static Map<String, UserDetails> userData = new ConcurrentHashMap<>();
    // sessionId : roomId
    private static Map<String, String> session_room = new ConcurrentHashMap<>();
    // roomId : room
    private static Map<String, Room> robby = new ConcurrentHashMap<>();

    private final SocketDataService socketDataService;
    private final PublishService publishService;

    /*
        TODO: 발행과 구독을 동시에 할 경우 메세지를 중복으로 보낼 수 있다.
        이상적: 따라서, 라우팅을 통해 자신에게는 publish한 메세지가 도달하지 않도록 처리하거나,
        차선책: publish 후 자체적으로 Room에 메세지를 보내는 로직을 삭제하고, subscribe한 메세지만 보내도록 해야한다.
    */
    @RabbitListener(queues = "robby.queue", concurrency = "10")
    public void receiveMessage(final Message message) {
        String messageStr = new String(message.getBody(), StandardCharsets.UTF_8);
        messageStr = messageStr.substring(1, messageStr.length() - 1).replace("\\", "");
        String[] messages = messageStr.split("\\|");
        String roomId = messages[0];

        if(robby.containsKey(roomId)) {
            Behavior behavior = Behavior.fromInteger(Integer.parseInt(messages[1]));
            try {
                switch (behavior) {
                    case ENTER:
                        EnterUserMessage enterUserMessage = JsonUtil.toObject(messages[2], EnterUserMessage.class);
                        sendMessageToRoom(roomId, enterUserMessage.getUserId(), Behavior.ENTER, enterUserMessage);
                        break;
                    case RESET:
                        String userId = messages[2];
                        robby.get(roomId).updateMap(socketDataService.getUserMap(Integer.parseInt(userId)));
                        robby.get(roomId).resetUserLocation();
                        synchronizeRoom(roomId, userId);
                        break;
                    case LEAVE:
                        LeaveUserMessage leaveUserMessage = JsonUtil.toObject(messages[2], LeaveUserMessage.class);
                        sendMessageToRoom(roomId, leaveUserMessage.getUserId(), Behavior.LEAVE, leaveUserMessage);
                        break;
                    case MOVE:
                        MoveUserMessage moveUserMessage = JsonUtil.toObject(messages[2], MoveUserMessage.class);
                        sendMessageToRoom(roomId, moveUserMessage.getUserId(), Behavior.MOVE, moveUserMessage);
                        break;
                }
            } catch (NullPointerException e) {
                e.printStackTrace();
                log.info("subscribe failed");
            }
        }
    }

    public synchronized Boolean enter(WebSocketSession session, EnterRequestMessage enterRequestMessage) throws NullPointerException{
        if(enterRequestMessage == null)
            return sendErrorMessage(session, ErrorCode.MESSAGE_PARSE_UNAVAILABLE);

        UserDetails userDetails = JwtUtil.getPayload(enterRequestMessage.getAuthorization());
        if(userDetails == null)
            return sendErrorMessage(session, ErrorCode.UNAUTHORIZED);

        String roomId = enterRequestMessage.getRoomId();
        String userId = userDetails.getIdx().toString();
        String sessionId = session.getId();

        // 등록이 되어있는지 확인하고 없으면 넣기
        // TODO: 세션이 달라질 경우, 세션이 같을 경우 처리 필요
        // REDIS 조회 (Room Data가 이미 있는지? 없으면 Room 생성 후 등록
        // Room 생성 시 필요한 것 : roomId, user, map
        if(session_room.containsKey(sessionId)) {
            robby.get(session_room.get(sessionId)).leave(userId, session);
            session_room.remove(sessionId);
        }

        // Room 생성
        Room room;
        if(!robby.containsKey(roomId)) {
            room = socketDataService.makeRoom(roomId);
            robby.put(roomId, room);
        } else {
            room = robby.get(roomId);
        }

        // Room 입장
        room.enter(userDetails, session);
        userData.put(sessionId, userDetails);
        user_session.put(userId, sessionId);
        session_room.put(sessionId, roomId);

        logObjectJson(room);

        // 입장 이벤트 전파
        EnterUserMessage enterUserMessage = EnterUserMessage.of(userDetails);
        // TODO: ENTER PUB/SUB
        publishService.publishEnterUser(roomId, enterUserMessage);
        // 본 서버의 publish까지 subscribe하여서 주석처리
        // sendMessageToRoom(roomId, userId, Behavior.ENTER, enterUserMessage);

        // Redis 갱신 & SYNC
        // 궁금: UserDto를 새로 만드는게 빠를까? vs 가져오는게 빠를까?
        Room cachedRoom = socketDataService.addUserToRedis(roomId, userId, room.getUsers().get(userId));
        SyncRoomMessage syncRoomMessage = SyncRoomMessage.of(cachedRoom);
        sendMessageToMe(session, Behavior.SYNC, syncRoomMessage);

        return true;
    }

    public Boolean move(WebSocketSession session, MoveRequestMessage moveRequestMessage) throws NullPointerException{
        String sessionId = session.getId();
        String userId = userData.get(sessionId).getIdx().toString();
        String roomId = session_room.get(sessionId);
        if(moveRequestMessage == null)
            return sendErrorMessage(session, ErrorCode.MESSAGE_PARSE_UNAVAILABLE);

        robby.get(roomId).moveUser(userId, moveRequestMessage.getDirection());
        socketDataService.moveUserInRedis(roomId, userId, moveRequestMessage.getDirection());
        // 움직임 이벤트 전파
        MoveUserMessage moveUserMessage = MoveUserMessage.of(userId, moveRequestMessage.getDirection());
        // TODO: MOVE PUB/SUB
        publishService.publishMoveUser(roomId, moveUserMessage);
        /*
          본 서버의 publish까지 subscribe하여서 주석처리
          sendMessageToRoom(roomId, userId, Behavior.MOVE, moveUserMessage);
        */

        return true;
    }

    public Boolean updateMap(WebSocketSession session, BuildRequestMessage buildRequestMessage) throws NullPointerException{
        UserDetails userDetails = userData.get(session.getId());
        String roomId = session_room.get(session.getId());
        String userId = userDetails.getIdx().toString();

        if(userDetails == null) {
            return sendErrorMessage(session, ErrorCode.UNAUTHORIZED);
        } else if(!userId.equals(roomId)) {
            return sendErrorMessage(session, ErrorCode.NO_PERMISSION);
        } else if(buildRequestMessage == null || buildRequestMessage.getMap() == null) {
            return sendErrorMessage(session, ErrorCode.MESSAGE_PARSE_UNAVAILABLE);
        }

        // Map 데이터 수정
        Boolean isSuccess = socketDataService.updateUserMap(Integer.parseInt(roomId), buildRequestMessage.getMap());
        if(isSuccess) {
            robby.get(roomId).updateMap(buildRequestMessage.getMap());
            // 유저 위치 리셋 & SYNC
            robby.get(roomId).resetUserLocation();
            // TODO: 리셋 PUB/SUB
            publishService.publishResetUserLocationAndSync(roomId, userId);
            socketDataService.resetUserLocationAndUpdateMap(roomId, buildRequestMessage.getMap());
            // 본 서버의 publish까지 subscribe하여서 주석처리
            //sendMessageToRoom(roomId, userDetails.getIdx().toString(), Behavior.SYNC, robby.get(roomId));
            return true;
        } else {
            //TODO: 실패 시 오류 메세지
            return sendErrorMessage(session, ErrorCode.SERVER_ERROR);
        }
    }

    public Boolean synchronizeRoom(String roomId, String userId) throws NullPointerException{
        Room room = socketDataService.getRoomCache(roomId);
        logObjectJson(room);

        if(room != null) {
            return sendMessageToRoom(
                    roomId,
                    userId,
                    Behavior.SYNC,
                    SyncRoomMessage.of(room)
            );
        } else {
            return false;
        }
    }

    public Boolean synchronizeRoom(WebSocketSession session) throws NullPointerException{
        Room room = socketDataService.getRoomCache(session_room.get(session.getId()));
        logObjectJson(room);

        if(room != null) {
            return sendMessageToRoom(
                    session_room.get(session.getId()),
                    userData.get(session.getId()).getIdx().toString(),
                    Behavior.SYNC,
                    SyncRoomMessage.of(room)
            );
        } else {
            return false;
        }
    }

    public synchronized Boolean closeConnection(WebSocketSession session) {
        String sessionId = session.getId();
        String roomId = session_room.get(sessionId);
        String userId = userData.get(sessionId).getIdx().toString();

        log.info("Close Connection : "  + sessionId + " " +userId);

        LeaveUserMessage leaveUserMessage = LeaveUserMessage.of(userId);
        //TODO: 떠나기 Pub/Sub
        publishService.publishLeaveUser(roomId, leaveUserMessage);
        // 본 서버의 publish까지 subscribe하여서 주석처리
        // sendMessageToRoom(roomId, userId, Behavior.LEAVE,leaveUserMessage);

        // 떠나기
        Integer userNum = robby.get(roomId).leave(userId, session);
        if(userNum.equals(0))
            robby.remove(roomId);
        user_session.remove(userId);
        userData.remove(sessionId);
        session_room.remove(sessionId);

        socketDataService.removeUserInRedis(roomId, userId);

        try {
            session.close(CloseStatus.NORMAL);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    public boolean sendErrorMessage(WebSocketSession session, ErrorCode errorCode) {
        sendMessageToMe(session, Behavior.ERROR, ErrorMessage.of(errorCode));
        return false;
    }

    public <T> boolean sendMessageToMe(WebSocketSession session, Behavior behavior, T data) {
        TextMessage textMessage = new TextMessage(behavior.getValue() + JsonUtil.toJson(data));

        return sendMessageToMe(session, textMessage);
    }

    public boolean sendMessageToMe(WebSocketSession session, TextMessage message) throws NullPointerException{
        try {
            synchronized (session) {
                session.sendMessage(message);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return true;
    }

    public <T> boolean sendMessageToRoom(String roomId, String myId, Behavior behavior, T data) {
        TextMessage textMessage = new TextMessage(behavior.getValue() + JsonUtil.toJson(data));

        return sendMessageToRoom(roomId, myId, textMessage);
    }

    public synchronized boolean sendMessageToRoom(String roomId, String myId, TextMessage message) throws NullPointerException{
        final List<WebSocketSession> sessions = robby.get(roomId).getSessions();
        for(WebSocketSession session : sessions) {
            try {
                if(!userData.get(session.getId()).getIdx().toString().equals(myId)) {
                    synchronized (session) {
                        session.sendMessage(message);
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return true;
    }

    public <T> boolean sendMessageToAll(String roomId, Behavior behavior, T data) {
        TextMessage textMessage = new TextMessage(behavior.getValue() + JsonUtil.toJson(data));

        return sendMessageToAll(roomId, textMessage);
    }

    public synchronized boolean sendMessageToAll(String roomId, TextMessage message) throws NullPointerException{
        final List<WebSocketSession> sessions = robby.get(roomId).getSessions();
        for(WebSocketSession session : sessions) {
            try {
                synchronized (session) {
                    session.sendMessage(message);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return true;
    }

    private <T> void logObjectJson(T object) {
        log.info(JsonUtil.toJson(object));
    }
}
