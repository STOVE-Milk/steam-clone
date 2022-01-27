package com.steam.library.service;

import com.steam.library.dto.Room;
import com.steam.library.dto.UserDto;
import com.steam.library.global.common.UserDetails;
import com.steam.library.global.common.message.EnterMessage;
import com.steam.library.global.util.JsonUtil;
import com.steam.library.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
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
    // roomId : session
    private static Map<String, WebSocketSession> sessions = new HashMap<>();

    private final SocketDataService socketDataService;

    public boolean enter(WebSocketSession session, String data) {
        EnterMessage enterMessage = JsonUtil.toObject(data, EnterMessage.class);
        //UserData 토큰에서 가져오기
        UserDetails userDetails = JwtUtil.getPayload(enterMessage.getToken());
        String roomId = enterMessage.getRoomId();
        String userId = userDetails.getIdx().toString();
        // 등록이 되어있는지 확인하고 없으면 넣기
        // REDIS 조회 (Room Data가 이미 있는지? 없으면 Room 생성 후 등록
        // Room 생성 시 필요한 것 : roomId, user, map
        if(!robby.containsKey(enterMessage.getRoomId())) {
            Room newRoom = socketDataService.getRoomData(roomId, userDetails.getIdx());
            robby.put(roomId, newRoom);
        }

        // Room 입장
        Room room = robby.get(roomId);
        if(!room.getUsers().containsKey(userId)) {
            room.getUserList().add(userId);
            room.getUsers().put(userId, UserDto.of(userDetails));
        }

        //Map 데이터 연결
        userData.put(session.getId(), userDetails);
        session_room.put(session.getId(), enterMessage.getRoomId());
        sessions.put(enterMessage.getRoomId(), session);

        logObjectJson(userData);
        logObjectJson(session_room);
        logObjectJson(robby.get(enterMessage.getRoomId()));

        return true;
    }

    public boolean closeConnection(WebSocketSession session) {
        String closeRoomId = session_room.get(session.getId());
        String userId = userData.get(session.getId()).getIdx().toString();

        // 떠나기
        Integer userNum = robby.get(closeRoomId).leave(userId);
        if(userNum.equals(0))
            robby.remove(closeRoomId);
        session_room.remove(session.getId());
        userData.remove(session.getId());
        sessions.remove(closeRoomId);

        return true;
    }

    private <T> void logObjectJson(T object) {
        log.info(JsonUtil.toJson(object));
    }
}
