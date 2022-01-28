package com.steam.library.dto;

import com.steam.library.global.common.Direction;
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

    public void move(Direction direction, Integer max) {
        switch (direction) {
            case UP:
                if(y < max)
                    y++;
                break;
            case RIGHT:
                if(x < max)
                    x++;
                break;
            case DOWN:
                if(y > 0)
                    y--;
                break;
            case LEFT:
                if (x > 0)
                    x--;
                break;
        }

    }
}
