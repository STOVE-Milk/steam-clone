package com.steam.membership.global.common;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDetails {
    Integer idx;
    Integer role;
    String nickname;
    String country;
}
