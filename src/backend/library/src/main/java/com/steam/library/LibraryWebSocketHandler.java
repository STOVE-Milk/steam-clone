package com.steam.library;

import com.steam.library.dto.MapDto;
import com.steam.library.dto.Room;
import com.steam.library.global.common.Behavior;
import com.steam.library.global.common.UserDetails;
import com.steam.library.global.common.message.InitMessage;
import com.steam.library.global.util.JsonUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class LibraryWebSocketHandler extends TextWebSocketHandler {
    // userId : UserDetail
    private static Map<String, UserDetails> userData = new HashMap<>();
    // sessionId : roomId
    private static Map<String, String> session_room = new HashMap<>();
    // roomId : room
    private static Map<String, Room> robby = new HashMap<>();
    // roomId : session
    private static Map<String, WebSocketSession> sessions = new HashMap<>();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        log.info("payload : " + payload);

        Integer behavior = Integer.parseInt(payload.substring(0, 2));
        String jsonData = payload.substring(2);

        //JsonUtil.toObject("{\"side\":5,\"games\":{\"test\":\"test\"},\"objects\":{\"test\":\"test\"}}", MapDto.class);
        log.info(JsonUtil.toJson(MapDto.newMap()));
        log.info(JsonUtil.toJson(session_room));

        if (behavior.equals(Behavior.INIT)) {
            InitMessage initMessage = JsonUtil.toObject(jsonData, InitMessage.class);
            session_room.put(session.getId(), initMessage.getRoomId());
            sessions.put(initMessage.getRoomId(), session);

            //REDIS 조회 (Room Data가 이미 있는지? 없으면 Room 생성 후 등록

            //Room 생성 시 필요한 것 : roomId, user, map
            //Map 데이터 조회

            Room room = robby.get(initMessage.getRoomId());
//            if(room == null)
//                robby.put(initMessage.getRoomId())
        }

    }

    /* Client가 접속 시 호출되는 메서드 */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("session id : " + session.getId());
        //sessions.put(session.getId(), session);

        log.info(session + " 클라이언트 접속");
    }

    /* Client가 접속 해제 시 호출되는 메서드드 */

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {

        log.info(session + " 클라이언트 접속 해제");
        String closeSessionId = session_room.get(session.getId());
        if(!closeSessionId.isBlank())
            sessions.remove(closeSessionId);
    }
}