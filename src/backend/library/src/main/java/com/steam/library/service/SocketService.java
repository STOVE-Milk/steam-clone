package com.steam.library.service;

import com.steam.library.dto.MapDto;
import com.steam.library.dto.Room;
import com.steam.library.dto.UserConnection;
import com.steam.library.dto.UserDto;
import com.steam.library.global.common.Behavior;
import com.steam.library.global.common.UserDetails;
import com.steam.library.dto.messages.*;
import com.steam.library.global.error.ErrorCode;
import com.steam.library.global.util.JsonUtil;
import com.steam.library.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.annotation.*;
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
    /*
        서버 내에서 유저의 상태 정보를 담고있는 Collection들 입니다.
        여러 스레드에서 동시에 객체에 접근하다보니 동시성 문제가 발생했고,
        이에 따라 Concurrent 패키지를 이용해 동시성 처리를 했습니다.
    */
    // userId : UserConnection(roomId, sessionId)
    // private static final Map<String, List<UserConnection>> userConnections = new ConcurrentHashMap<>();
    // sessionId : UserDetails
    private static final Map<String, UserDetails> userData = new ConcurrentHashMap<>();
    // sessionId : roomId
    private static final Map<String, String> session_room = new ConcurrentHashMap<>();
    // roomId : room
    private static final Map<String, Room> lobby = new ConcurrentHashMap<>();

    private final SocketDataService socketDataService;
    private final PublishService publishService;

    /*
        TODO: 로직 정하기
        발행과 구독을 같은 서버에서 할 경우 각 세션에 메세지를 중복으로 보낼 수 있다.
        따라서, 라우팅을 통해 자신이 발행한 메세지는 소비하지 않도록 처리하거나,
        발행 후 자체적으로 방의 세션들에 메세지를 보내는 로직을 삭제하고, 소비한 메세지만 보내도록 해야한다.
    */

    /*
        메세지 큐의 메세지를 소비하고, 메세지 내용에 따라 각 세션에 메세지를 전송하는 역할만 합니다.

        많은 요청이 들어올 경우 메세지를 발행하는 속도가 소비하는 속도보다 빠를 수 있어
        concurrency 옵션을 통해 소비하는 속도를 높여보려 했지만 concurrency 수 만큼 메세지를 중복으로 소비해서 방법을 찾고있습니다.
        동일한 채널에서 concurrency 수 만큼 구독하게 되는데, 채널이 같아서 구독한 목록 중 배분해서 소비할 줄 알았지만, 전체가 함께 소비합니다.
    */
    @RabbitListener(
            bindings = @QueueBinding(
                    value = @Queue(
                            value = "lobby.queue",
                            arguments = @Argument(name = "x-queue-type", value = "stream")
                    ),
                    exchange = @Exchange(value = "steam.lobby", type = "topic")
            )
    )
    public void receiveMessage(final Message message) {
        String messageStr = new String(message.getBody(), StandardCharsets.UTF_8);
        if(messageStr.isBlank()) {
            log.info("consume no message");
            return;
        }

        messageStr = messageStr.substring(1, messageStr.length() - 1).replace("\\", "");
        String[] messages = messageStr.split("\\|");
        String roomId = messages[0];

        if(lobby.containsKey(roomId)) {
            try {
                Behavior behavior = Behavior.fromInteger(Integer.parseInt(messages[1]));
                switch (behavior) {
                    case ENTER:
                        EnterUserMessage enterUserMessage = JsonUtil.toObject(messages[2], EnterUserMessage.class);
                        sendMessageToRoom(roomId, enterUserMessage.getUserId(), Behavior.ENTER, enterUserMessage);
                        break;
                    case RESET:
                        String userId = messages[2];
                        lobby.get(roomId).updateMap(socketDataService.getUserMap(Integer.parseInt(userId)));
                        lobby.get(roomId).resetUserLocation();
                        synchronizeRoom(roomId);
                        break;
                    case LEAVE:
                        LeaveUserMessage leaveUserMessage = JsonUtil.toObject(messages[2], LeaveUserMessage.class);
                        sendMessageToRoom(roomId, leaveUserMessage.getUserId(), Behavior.LEAVE, leaveUserMessage);
                        break;
                    case MOVE:
                        MoveUserMessage moveUserMessage = JsonUtil.toObject(messages[2], MoveUserMessage.class);
                        sendMessageToRoom(roomId, moveUserMessage.getUserId(), Behavior.MOVE, moveUserMessage);
                        break;
                    case CLOSE_PRE_SESSION:
                        // 같은 방에 중복 입장 시 기존 연결을 끊는 메세지
                        ClosePreConnectionMessage closePreConnectionMessage = JsonUtil.toObject(messages[2], ClosePreConnectionMessage.class);
                        String preSessionId = closePreConnectionMessage.getPreSessionId();
                        if(session_room.containsKey(preSessionId)) {
                            log.info("session close multi enter... " + closePreConnectionMessage.getUserId());
                            session_room.remove(preSessionId);
                            userData.remove(preSessionId);
                            WebSocketSession preSession = lobby.get(roomId).getSessionBySessionId(preSessionId);
                            /*
                                만약 새로 접속한 세션의 Id가 서버 내 변수에 등록되어 있다면 같은 로비 서버에 접근한 것이고,
                                입장 메소드에서 갱신되므로. 유저 데이터는 삭제가 필요 없음
                            */
                            if(!session_room.containsKey(closePreConnectionMessage.getPostSessionId())) {
                                lobby.get(roomId).leave(closePreConnectionMessage.getUserId(), preSessionId);
                            } else {
                                // session 정보는 삭제해줘야함
                                lobby.get(roomId).getSessions().remove(preSessionId);
                            }

                            sendMessageToMe(preSession, Behavior.CLOSE_PRE_SESSION, ErrorMessage.of(ErrorCode.ENTER_SAME_ROOM));
                            preSession.close(CloseStatus.NORMAL);
                        }
                        break;
                }
            } catch (NullPointerException e) {
                e.printStackTrace();
                log.info("subscribe failed");
            } catch (IOException e) {
                log.info("session close failed when multi enter in same room");
            }
        }
    }

    public synchronized Boolean checkMultiConnectionToSameRoom(WebSocketSession session, EnterRequestMessage enterRequestMessage) {
        if(enterRequestMessage == null)
            return sendErrorMessage(session, ErrorCode.MESSAGE_PARSE_UNAVAILABLE);

        UserDetails userDetails = JwtUtil.getPayload(enterRequestMessage.getAuthorization());
        if(userDetails == null)
            return sendErrorMessage(session, ErrorCode.UNAUTHORIZED);

        // roomId:sessionId 로 roomId를 가지고 이전 sessionId를 가져옴
        String preSessionId = socketDataService.getPreSessionIdByRoomId(userDetails.getIdx().toString(), enterRequestMessage.getRoomId());
        // 이전 세션이 존재한다는 것이 중복 접근이라는 것, null일 경우는 같은 방에 접속한 것이 아니라는 것
        if(preSessionId != null) {
            ClosePreConnectionMessage closePreConnectionMessage = ClosePreConnectionMessage.builder()
                    .userId(userDetails.getIdx().toString())
                    .preSessionId(preSessionId)
                    .postSessionId(session.getId())
                    .build();

            publishService.publishClosePreConnection(enterRequestMessage.getRoomId(), closePreConnectionMessage);
        }
        return true;
    }

    public boolean isEnteredUserSession(String sessionId) {
        return session_room.containsKey(sessionId);
    }
    /*
        synchronized 참고자료 : https://jgrammer.tistory.com/entry/Java-%ED%98%BC%EB%8F%99%EB%90%98%EB%8A%94-synchronized-%EB%8F%99%EA%B8%B0%ED%99%94-%EC%A0%95%EB%A6%AC
    */
    public synchronized Boolean enter(WebSocketSession session, EnterRequestMessage enterRequestMessage) throws NullPointerException{
        if(enterRequestMessage == null)
            return sendErrorMessage(session, ErrorCode.MESSAGE_PARSE_UNAVAILABLE);

        UserDetails userDetails = JwtUtil.getPayload(enterRequestMessage.getAuthorization());
        if(userDetails == null)
            return sendErrorMessage(session, ErrorCode.UNAUTHORIZED);

        String roomId = enterRequestMessage.getRoomId();
        String userId = userDetails.getIdx().toString();
        String sessionId = session.getId();

        // 방 생성
        Room room;
        if(!lobby.containsKey(roomId)) {
            room = socketDataService.makeRoom(roomId, userId);
            lobby.put(roomId, room);
        } else {
            room = lobby.get(roomId);
        }

        // 방 입장
        room.enter(userDetails, session);
        userData.put(sessionId, userDetails);
        session_room.put(sessionId, roomId);

        // 입장 메세지 발행
        EnterUserMessage enterUserMessage = EnterUserMessage.of(userDetails);
        publishService.publishEnterUser(roomId, enterUserMessage);
        // 본인이 발행한 메세지까지 소비해서 주석처리
        // sendMessageToRoom(roomId, userId, Behavior.ENTER, enterUserMessage);

        // Redis 갱신 & 데이터 동기화
        socketDataService.addUserConnectionToRedis(userId, roomId, sessionId);
        Room cachedRoom = socketDataService.addUserToRedis(roomId, userId, UserDto.of(userDetails));
        SyncRoomMessage syncRoomMessage = SyncRoomMessage.of(cachedRoom);
        sendMessageToMe(session, Behavior.SYNC, syncRoomMessage);

        return true;
    }

    // 이동 메소드 입니다.
    public Boolean move(WebSocketSession session, MoveRequestMessage moveRequestMessage) throws NullPointerException{
        String sessionId = session.getId();
        String userId = userData.get(sessionId).getIdx().toString();
        String roomId = session_room.get(sessionId);
        if(moveRequestMessage == null)
            return sendErrorMessage(session, ErrorCode.MESSAGE_PARSE_UNAVAILABLE);

        // Direction Enum의 값 대로 이동을 시킵니다.
        lobby.get(roomId).moveUser(userId, moveRequestMessage.getDirection());
        socketDataService.moveUserInRedis(roomId, userId, moveRequestMessage.getDirection());

        // 이동 메세지 발행
        MoveUserMessage moveUserMessage = MoveUserMessage.of(userId, moveRequestMessage.getDirection());
        publishService.publishMoveUser(roomId, moveUserMessage);

        return true;
    }

    /*
        유저가 소유한 맵 정보를 수정하는 기능입니다.
        맵 수정(게임 오브젝트 설치) 시 유저가 오브젝트에 막혀 움직일 수 없는 상황을 대비해
        맵이 수정된다면 모든 접속한 유저의 위치를 초기 위치로 리셋시키고, 리셋 + 데이터 동기화 메세지를 발행합니다.
    */
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
            lobby.get(roomId).updateMap(buildRequestMessage.getMap());
            // 유저 위치 리셋 & 데이터 동기화
            lobby.get(roomId).resetUserLocation();
            publishService.publishResetUserLocationAndSync(roomId, userId);
            socketDataService.resetUserLocationAndUpdateMap(roomId, buildRequestMessage.getMap());
            return true;
        } else {
            return sendErrorMessage(session, ErrorCode.SERVER_ERROR);
        }
    }

    public Boolean synchronizeRoom(String roomId) throws NullPointerException{
        Room room = socketDataService.getRoomCache(roomId);
        logObjectJson(room);

        if(room != null) {
            return sendMessageToAll(
                    roomId,
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

        if(lobby.containsKey(roomId)) {
            String userId = userData.get(sessionId).getIdx().toString();

            log.info("Close Connection : "  + sessionId + " " +userId);

            // 떠나기
            Integer userNum = lobby.get(roomId).leave(userId, sessionId);
            if (userNum.equals(0))
                lobby.remove(roomId);
            userData.remove(sessionId);
            session_room.remove(sessionId);

            socketDataService.removeUserConnectionToRedis(userId, roomId);
            socketDataService.removeUserInRedis(roomId, userId);

            LeaveUserMessage leaveUserMessage = LeaveUserMessage.of(userId);
            publishService.publishLeaveUser(roomId, leaveUserMessage);
        }

        try {
            session.close(CloseStatus.NORMAL);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    /*
        HTTP 통신 API처럼 에러 Response를 따로 줄 수 없다고 생각해서
        웹 소켓에 대한 에러 처리를 어떻게 할까 고민하던 중 에러 메세지를 소켓으로 보내기로 했습니다.
        에러 상황의 경우 유저 자신(현재 세션)에게만 적용된다고 판단하여 본인에게만 전송합니다.
    */
    public boolean sendErrorMessage(WebSocketSession session, ErrorCode errorCode) {
        sendMessageToMe(session, Behavior.ERROR, ErrorMessage.of(errorCode));
        return false;
    }

    /*
        이 아래로는 세션에 메세지를 전송하는 메소드들입니다.
        본인, 방에 접속되어 있는 본인을 제외한 모두, 모두 에게 전송하는 메소드가 있습니다.

        session 객체에 대한 동기화 처리
            Jmeter를 이용한 동시 요청을 테스트 해봤습니다.
            메세지를 보내는 와중 유저의 세션이 종료되는 등
            세션에 대한 정보가 삭제되거나 없을 경우 NullPointerException이 발생했고,
            세션에 동시에 메세지를 보낼 수 없다는 오류가 발생했습니다.
            따라서 동기화 처리를 해주었습니다.
    */
    public <T> boolean sendMessageToMe(WebSocketSession session, Behavior behavior, T data) {
        TextMessage textMessage = new TextMessage(behavior.getValue() + JsonUtil.toJson(data));

        return sendMessageToMe(session, textMessage);
    }

    public boolean sendMessageToMe(WebSocketSession session, TextMessage message) throws NullPointerException{
        try {
            synchronized (session) {
                if(session != null && session.isOpen())
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

    // 자신을 제외한 같은 방의 유저들에게 메세지를 전송합니다.
    public synchronized boolean sendMessageToRoom(String roomId, String myId, TextMessage message) throws NullPointerException{
        if(lobby.containsKey(roomId)) {
            final Map<String, WebSocketSession> sessions = lobby.get(roomId).getSessions();
            sessions.forEach( (userId, session) -> {
                try {
                    if (!userData.get(session.getId()).getIdx().toString().equals(myId)) {
                        synchronized (session) {
                            if(session != null && session.isOpen())
                                session.sendMessage(message);
                        }
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        }

        return true;
    }

    public <T> boolean sendMessageToAll(String roomId, Behavior behavior, T data) {
        TextMessage textMessage = new TextMessage(behavior.getValue() + JsonUtil.toJson(data));

        return sendMessageToAll(roomId, textMessage);
    }

    public synchronized boolean sendMessageToAll(String roomId, TextMessage message) throws NullPointerException{
        if(lobby.containsKey(roomId)) {
            final Map<String, WebSocketSession> sessions = lobby.get(roomId).getSessions();
            sessions.forEach( (userId, session) -> {
                try {
                    synchronized (session) {
                        if(session != null && session.isOpen())
                            session.sendMessage(message);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            });
        }

        return true;
    }

    private <T> void logObjectJson(T object) {
        log.info(JsonUtil.toJson(object));
    }
}
