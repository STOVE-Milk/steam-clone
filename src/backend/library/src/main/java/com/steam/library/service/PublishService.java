package com.steam.library.service;

import com.steam.library.dto.messages.EnterUserMessage;
import com.steam.library.dto.messages.LeaveUserMessage;
import com.steam.library.dto.messages.MoveUserMessage;
import com.steam.library.global.common.Behavior;
import com.steam.library.global.util.JsonUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class PublishService {
    private static final String EXCHANGE_KEY = "steam.lobby";
    private static final String ROUTING_KEY = "lobby.normal";

    private final RabbitTemplate rabbitTemplate;

    /*
        데이터 형식: roomId|BehaviorCode|Message
        데이터 형식에 따른 메세지를 발행합니다.
        형식이 비슷하여 제네릭을 이용해 메소드를 통일할까 고민중인 상태입니다.
        요청에 따라 형식이 변경될 여지가 있다고 판단하여 나누어둔 상태입니다.
    */
    public boolean publishEnterUser(String roomId, EnterUserMessage enterUserMessage) {
        String message = roomId + "|" + Behavior.ENTER.getValue() + "|" + JsonUtil.toJson(enterUserMessage);
        rabbitTemplate.convertAndSend(EXCHANGE_KEY, ROUTING_KEY, message);
        return true;
    }
    public boolean publishMoveUser(String roomId, MoveUserMessage moveUserMessage) {
        String message = roomId + "|" + Behavior.MOVE.getValue() + "|" + JsonUtil.toJson(moveUserMessage);
        rabbitTemplate.convertAndSend(EXCHANGE_KEY, ROUTING_KEY, message);
        return true;
    }
    public boolean publishLeaveUser(String roomId, LeaveUserMessage leaveUserMessage) {
        String message = roomId + "|" + Behavior.LEAVE.getValue() + "|" + JsonUtil.toJson(leaveUserMessage);
        rabbitTemplate.convertAndSend(EXCHANGE_KEY, ROUTING_KEY, message);
        return true;
    }
    public boolean publishResetUserLocationAndSync(String roomId, String userId) {
        String message = roomId + "|" + Behavior.RESET.getValue() + "|" + userId;
        rabbitTemplate.convertAndSend(EXCHANGE_KEY, ROUTING_KEY, message);
        return true;
    }
}
