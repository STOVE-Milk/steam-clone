package com.steam.membership.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.membership.entity.User;
import com.steam.membership.global.util.JsonUtil;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Date;

@Builder
@Getter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto {
    private Integer id;
    private String nickname;
    private Integer isFriend;
    private Integer wasRequested;
    private ProfileDto profile;
    private LocalDateTime accessedAt;
    private LocalDateTime createdAt;

    public static UserDto of(final User user) {
        return UserDto.builder()
                .id(user.getIdx())
                .nickname(user.getNickname())
                .profile(JsonUtil.toObject(user.getProfile(), ProfileDto.class))
                .accessedAt(user.getAccessedAt())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static UserDto of(final UserWithIsFriend user) {
        return UserDto.builder()
                .id(user.getIdx())
                .nickname(user.getNickname())
                .isFriend(user.getIsFriend())
                .wasRequested(user.getWasRequested())
                .profile(JsonUtil.toObject(user.getProfile(), ProfileDto.class))
                .accessedAt(user.getAccessedAt())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static UserDto of(final User user, LocalDateTime createdAt) {
        return UserDto.builder()
                .id(user.getIdx())
                .nickname(user.getNickname())
                .profile(JsonUtil.toObject(user.getProfile(), ProfileDto.class))
                .accessedAt(user.getAccessedAt())
                .createdAt(createdAt)
                .build();
    }

    public static UserDto of(final User user, Boolean isFriend) {
        return UserDto.builder()
                .id(user.getIdx())
                .nickname(user.getNickname())
                .isFriend(isFriend ? 1 : 0)
                .profile(JsonUtil.toObject(user.getProfile(), ProfileDto.class))
                .accessedAt(user.getAccessedAt())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
