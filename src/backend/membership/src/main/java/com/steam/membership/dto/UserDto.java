package com.steam.membership.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.membership.entity.User;
import com.steam.membership.global.util.JsonUtil;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Builder
@Getter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class UserDto {
    private Integer idx;
    private String nickname;
    private ProfileDto profile;
    private Date createdAt;

    public static UserDto of(final User user) {
        return UserDto.builder()
                .idx(user.getIdx())
                .nickname(user.getNickname())
                .profile(JsonUtil.toObject(user.getProfile(), ProfileDto.class))
                .createdAt(user.getCreatedAt())
                .build();
    }
}
