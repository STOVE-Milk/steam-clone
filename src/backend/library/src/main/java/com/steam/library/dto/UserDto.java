package com.steam.library.dto;

import com.steam.library.global.common.UserDetails;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Builder
@Data
public class UserDto {
    private String nickname;
    private Integer x;
    private Integer y;

    public static UserDto of(UserDetails userDetails) {
        return UserDto.builder()
                .nickname(userDetails.getNickname())
                .x(0)
                .y(0)
                .build();
    }
}
