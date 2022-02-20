package com.steam.library.global.common;

import com.steam.library.dto.UserDto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDetails {
    Integer idx;
    Integer role;
    String nickname;
    String country;
    Integer iat;
    Integer exp;
}

