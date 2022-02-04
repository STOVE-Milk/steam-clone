package com.steam.library.global.common.messages;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.library.global.common.Direction;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class MoveUserMessage {
    String userId;
    Integer direction;

    public static MoveUserMessage of(String userId, Direction direction) {
        return MoveUserMessage.builder()
                .userId(userId)
                .direction(direction.getValue())
                .build();
    }
}
