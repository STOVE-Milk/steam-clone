package com.steam.library;

import com.steam.library.dto.MapDto;
import com.steam.library.global.common.Behavior;
import com.steam.library.service.SocketService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Slf4j
@Component
public class LibraryWebSocketHandler extends TextWebSocketHandler {
    private final SocketService socketService;

    public LibraryWebSocketHandler(SocketService socketService) {
        this.socketService = socketService;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        Behavior behavior = Behavior.fromInteger(Integer.parseInt(payload.substring(0, 2)));
        String jsonData = (payload.length() > 2) ? payload.substring(2) : "";
        Boolean isSuccessed = false;
        if (session.isOpen()) {
            try {
                switch (behavior) {
                    case ENTER:
                        socketService.enter(session, jsonData);
                        break;
                    case SYNC:
                        socketService.synchronizeRoom(session);
                        break;
                    case LEAVE:
                        socketService.closeConnection(session);
                        break;
                    case MOVE:
                        socketService.move(session, jsonData);
                        break;
                    case BUILD:
                        socketService.updateMap(session, jsonData);
                        break;
                }
            } catch (NullPointerException e) {
                e.printStackTrace();
                socketService.closeConnection(session);
            }
        }
    }

    /* Client가 접속 시 호출되는 메서드 */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        log.info("session id : " + session.getId());
        log.info(session + " 클라이언트 접속");
    }

    /* Client가 접속 해제 시 호출되는 메서드드 */

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        if(!status.equals(CloseStatus.NORMAL)) {
            log.info("CloseStatus of " + session.getId() + " : " + status);
            socketService.closeConnection(session);
        }

        log.info(session + " 클라이언트 접속 해제 완료");
    }

}