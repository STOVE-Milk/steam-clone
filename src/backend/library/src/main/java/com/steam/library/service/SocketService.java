package com.steam.library.service;

import com.steam.library.dto.Room;
import com.steam.library.global.common.UserDetails;
import com.steam.library.global.common.message.InitMessage;
import com.steam.library.global.util.JsonUtil;
import com.steam.library.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class SocketService {
    // userId : UserDetail
    private static Map<String, UserDetails> userData = new HashMap<>();
    // sessionId : roomId
    private static Map<String, String> session_room = new HashMap<>();
    // roomId : room
    private static Map<String, Room> robby = new HashMap<>();
    // roomId : session
    private static Map<String, WebSocketSession> sessions = new HashMap<>();

    private final SocketDataService socketDataService;

    public boolean init(WebSocketSession session, String data) {
        InitMessage initMessage = JsonUtil.toObject(data, InitMessage.class);
        //UserData 토큰에서 가져오기
        UserDetails userDetails = JwtUtil.getPayload(initMessage.getToken());
        String roomId = initMessage.getRoomId();

        // 등록이 되어있는지 확인하고 없으면 넣기
        // REDIS 조회 (Room Data가 이미 있는지? 없으면 Room 생성 후 등록

        // Room 생성 시 필요한 것 : roomId, user, map
        if(!robby.containsKey(initMessage.getRoomId())) {
            Room newRoom = socketDataService.getRoomData(roomId);
        }
        userData.put(userDetails.getIdx().toString(), userDetails);
        session_room.put(session.getId(), initMessage.getRoomId());
        sessions.put(initMessage.getRoomId(), session);

        //Map 데이터 조회
        socketDataService.getUserMap(userDetails.getIdx());

        Room room = robby.get(initMessage.getRoomId());
//            if(room == null)
//                robby.put(initMessage.getRoomId())
    }

    public boolean closeConnection(WebSocketSession session) {
        String closeSessionId = session_room.get(session.getId());
        if(!closeSessionId.isBlank())
            sessions.remove(closeSessionId);

        return true;
    }
}
