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
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class SocketService {
    // sessionId : UserDetail
    private static Map<String, UserDetails> userData = new HashMap<>();
    // sessionId : roomId
    private static Map<String, String> session_room = new HashMap<>();
    // roomId : room
    private static Map<String, Room> robby = new HashMap<>();

    private final SocketDataService socketDataService;

    public String enter(WebSocketSession session, String data) {
        EnterRequestMessage enterRequestMessage = JsonUtil.toObject(data, EnterRequestMessage.class);
        //UserData 토큰에서 가져오기
        UserDetails userDetails = JwtUtil.getPayload(enterRequestMessage.getAuthorization());
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
            Room newRoom = socketDataService.getRoomData(roomId, userDetails.getIdx());
            robby.put(roomId, newRoom);
        }

        // Room 입장
        Room room = robby.get(roomId);
        room.enter(userDetails, session);

        //Map 데이터 연결
        userData.put(sessionId, userDetails);
        session_room.put(sessionId, roomId);

        EnterUserMessage enterUserMessage = EnterUserMessage.of(userDetails);
        sendMessageToRoom(roomId, userId, Behavior.ENTER, enterUserMessage);

        SyncRoomMessage syncRoomMessage = SyncRoomMessage.of(room);
        sendMessageToMe(session, Behavior.SYNC, syncRoomMessage);

        socketDataService.saveRoomData(room);

        return roomId;
    }

    public String move(String sessionId, String data) {
        String userId = userData.get(sessionId).getIdx().toString();
        String roomId = session_room.get(sessionId);
        MoveRequestMessage moveRequestMessage = JsonUtil.toObject(data, MoveRequestMessage.class);

        robby.get(roomId).move(userId, moveRequestMessage.getDirection());

        logObjectJson(robby.get(roomId));

        MoveUserMessage moveUserMessage = MoveUserMessage.of(userId, moveRequestMessage.getDirection());
        sendMessageToRoom(roomId, userId, Behavior.MOVE, moveUserMessage);

        return roomId;
    }

    public String closeConnection(WebSocketSession session) {
        String sessionId = session.getId();
        String closeRoomId = session_room.get(sessionId);
        String userId = userData.get(sessionId).getIdx().toString();

        // 떠나기
        Integer userNum = robby.get(closeRoomId).leave(userId, session);
        if(userNum.equals(0))
            robby.remove(closeRoomId);
        session_room.remove(sessionId);
        userData.remove(sessionId);

        return closeRoomId;
    }

    private <T> boolean sendMessageToMe(WebSocketSession session, Behavior behavior, T data) {
        TextMessage textMessage = new TextMessage(behavior.getValue() + JsonUtil.toJson(data));

        return sendMessageToMe(session, textMessage);
    }

    public boolean sendMessageToMe(WebSocketSession session, TextMessage message) {
        try {
            session.sendMessage(message);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return true;
    }

    private <T> boolean sendMessageToRoom(String roomId, String myId, Behavior behavior, T data) {
        TextMessage textMessage = new TextMessage(behavior.getValue() + JsonUtil.toJson(data));

        return sendMessageToRoom(roomId, myId, textMessage);
    }

    public boolean sendMessageToRoom(String roomId, String myId, TextMessage message) {
        final List<WebSocketSession> sessions = robby.get(roomId).getSessions();

        for(WebSocketSession session : sessions) {
            try {
                if(!userData.get(session.getId()).getIdx().toString().equals(myId))
                    session.sendMessage(message);
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
