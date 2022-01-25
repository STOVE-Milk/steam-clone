package com.steam.library.dto;

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
}
