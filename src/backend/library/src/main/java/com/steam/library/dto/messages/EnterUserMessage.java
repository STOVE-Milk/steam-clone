package com.steam.library.dto.messages;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.library.global.common.UserDetails;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class EnterUserMessage {
    String userId;
    String nickname;

    public static EnterUserMessage of(UserDetails userDetails) {
        return EnterUserMessage.builder()
                .userId(userDetails.getIdx().toString())
                .nickname(userDetails.getNickname())
                .build();
    }
}
