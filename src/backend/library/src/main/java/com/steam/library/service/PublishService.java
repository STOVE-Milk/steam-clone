package com.steam.library.service;

import com.steam.library.dto.messages.EnterUserMessage;
import com.steam.library.dto.messages.LeaveUserMessage;
import com.steam.library.dto.messages.MoveUserMessage;
import com.steam.library.global.common.Behavior;
import com.steam.library.global.util.JsonUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PublishService {
    private static final String EXCHANGE_KEY = "steam.robby";
    private static final String ROUTING_KEY = "robby.normal";

    private final RabbitTemplate rabbitTemplate;

    public boolean publishEnterUser(String roomId, EnterUserMessage enterUserMessage) {
        rabbitTemplate.convertAndSend(EXCHANGE_KEY, ROUTING_KEY, roomId + "|" + Behavior.ENTER.getValue() + "|" + JsonUtil.toJson(enterUserMessage));
        return true;
    }
    public boolean publishMoveUser(String roomId, MoveUserMessage moveUserMessage) {
        rabbitTemplate.convertAndSend(EXCHANGE_KEY, ROUTING_KEY, roomId + "|" + Behavior.MOVE.getValue() + "|" + JsonUtil.toJson(moveUserMessage));
        return true;
    }
    public boolean publishLeaveUser(String roomId, LeaveUserMessage leaveUserMessage) {
        rabbitTemplate.convertAndSend(EXCHANGE_KEY, ROUTING_KEY, roomId + "|" + Behavior.LEAVE.getValue() + "|" + JsonUtil.toJson(leaveUserMessage));
        return true;
    }
    public boolean publishResetUserLocationAndSync(String roomId) {
        rabbitTemplate.convertAndSend(EXCHANGE_KEY, ROUTING_KEY, roomId + "|" + Behavior.RESET.getValue());
        return true;
    }
}
