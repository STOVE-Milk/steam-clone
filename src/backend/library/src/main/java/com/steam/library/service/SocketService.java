package com.steam.library.service;

import com.steam.library.dto.Room;
import com.steam.library.global.common.Behavior;
import com.steam.library.global.common.Direction;
import com.steam.library.global.common.UserDetails;
import com.steam.library.global.common.messages.*;
import com.steam.library.global.error.CustomException;
import com.steam.library.global.error.ErrorCode;
import com.steam.library.global.util.JsonUtil;
import com.steam.library.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@RequiredArgsConstructor
@Service
public class SocketService {
    // sessionId : UserDetails
    private static Map<String, UserDetails> userData = new ConcurrentHashMap<>();
    // sessionId : roomId
    private static Map<String, String> session_room = new ConcurrentHashMap<>();
    // roomId : room
    private static Map<String, Room> robby = new ConcurrentHashMap<>();

    private final SocketDataService socketDataService;

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
        // REDIS 조회 (Room Data가 이미 있는지? 없으면 Room 생성 후 등록
        // Room 생성 시 필요한 것 : roomId, user, map
        if(session_room.containsKey(sessionId)) {
            robby.get(session_room.get(sessionId)).leave(userId, session);
            session_room.remove(sessionId);
        }

        if(!robby.containsKey(roomId)) {
            Room newRoom = socketDataService.getRoomHash(roomId, userDetails.getIdx());
            robby.put(roomId, newRoom);
        }

        // Room 입장
        Room room = robby.get(roomId);
        room.enter(userDetails, session);

        // Map 데이터 연결
        userData.put(sessionId, userDetails);
        session_room.put(sessionId, roomId);

        logObjectJson(room);

        // 입장 이벤트 전파
        EnterUserMessage enterUserMessage = EnterUserMessage.of(userDetails);
        sendMessageToRoom(roomId, userId, Behavior.ENTER, enterUserMessage);

        // 기존 데이터랑 SYNC 
        SyncRoomMessage syncRoomMessage = SyncRoomMessage.of(room);
        sendMessageToMe(session, Behavior.SYNC, syncRoomMessage);

        socketDataService.saveRoomHash(room);

        return true;
    }

    public Boolean move(WebSocketSession session, MoveRequestMessage moveRequestMessage) throws NullPointerException{
        String sessionId = session.getId();
        String userId = userData.get(sessionId).getIdx().toString();
        String roomId = session_room.get(sessionId);
        if(moveRequestMessage == null)
            return sendErrorMessage(session, ErrorCode.MESSAGE_PARSE_UNAVAILABLE);

        robby.get(roomId).move(userId, moveRequestMessage.getDirection());

        // 움직임 이벤트 전파
        MoveUserMessage moveUserMessage = MoveUserMessage.of(userId, moveRequestMessage.getDirection());
        // TODO: MOVE PUB/SUB
        sendMessageToRoom(roomId, userId, Behavior.MOVE, moveUserMessage);

        return true;
    }

    public Boolean updateMap(WebSocketSession session, BuildRequestMessage buildRequestMessage) throws NullPointerException{
        UserDetails userDetails = userData.get(session.getId());
        String roomId = session_room.get(session.getId());

        if(userDetails == null) {
            return sendErrorMessage(session, ErrorCode.UNAUTHORIZED);
        } else if(!userDetails.getIdx().toString().equals(roomId)) {
            return sendErrorMessage(session, ErrorCode.NO_PERMISSION);
        } else if(buildRequestMessage == null || buildRequestMessage.getMap() == null) {
            return sendErrorMessage(session, ErrorCode.MESSAGE_PARSE_UNAVAILABLE);
        }

        // Map 데이터 수정
        socketDataService.updateUserMap(Integer.parseInt(roomId), buildRequestMessage.getMap());
        robby.get(roomId).updateMap(buildRequestMessage.getMap());
        socketDataService.saveRoomHash(robby.get(roomId));

        // 리셋 & SYNC
        robby.get(roomId).resetUserLocation();
        sendMessageToRoom(roomId, userDetails.getIdx().toString(), Behavior.SYNC, robby.get(roomId));

        return true;
    }

    public Boolean synchronizeRoom(WebSocketSession session) {
        logObjectJson(robby.get(session_room.get(session.getId())));

        return sendMessageToRoom(
                session_room.get(session.getId()),
                userData.get(session.getId()).getIdx().toString(),
                Behavior.SYNC,
                SyncRoomMessage.of(robby.get(session.getId()))
        );
    }

    public synchronized Boolean closeConnection(WebSocketSession session) {
        String sessionId = session.getId();
        String closeRoomId = session_room.get(sessionId);
        String userId = userData.get(sessionId).getIdx().toString();

        log.info("Close Connection : "  + sessionId + " " +userId);

        sendMessageToRoom(closeRoomId, userId, Behavior.LEAVE, LeaveUserMessage.of(userId));

        // 떠나기
        Integer userNum = robby.get(closeRoomId).leave(userId, session);
        if(userNum.equals(0))
            robby.remove(closeRoomId);
        session_room.remove(sessionId);
        userData.remove(sessionId);

        try {
            session.close(CloseStatus.NORMAL);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    public boolean sendErrorMessage(WebSocketSession session, ErrorCode errorCode) {
        sendMessageToMe(session, Behavior.ERROR, errorCode.getMessage());
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
                    session.sendMessage(message);
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
