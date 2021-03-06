package com.steam.library.dto.messages;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class LeaveUserMessage {
    String userId;

    public static LeaveUserMessage of(String userId) {
        return LeaveUserMessage.builder()
                .userId(userId)
                .build();
    }
}
