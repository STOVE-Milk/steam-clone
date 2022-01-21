package com.steam.membership.dto;

import com.steam.membership.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
public class FriendsResponse {
    List<UserDto> friends;

    public static FriendsResponse of(final List<User> users) {
        return FriendsResponse.builder()
                .friends(
                        users.stream()
                                .map(UserDto::of)
                                .collect(Collectors.toList())
                )
                .build();
    }
}
