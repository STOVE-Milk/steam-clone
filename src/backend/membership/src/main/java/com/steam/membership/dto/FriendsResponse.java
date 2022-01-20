package com.steam.membership.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class FriendsResponse {
    List<UserDto> friends;
}
