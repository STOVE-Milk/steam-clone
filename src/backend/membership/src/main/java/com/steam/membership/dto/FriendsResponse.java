package com.steam.membership.dto;

import com.steam.membership.entity.Friend;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
public class FriendsResponse {
    List<UserDto> friends;

    public static FriendsResponse of(final List<Friend> users) {
        return FriendsResponse.builder()
                .friends(
                        users.stream()
                                .map(friend -> UserDto.of(friend.getFriend()))
                                .collect(Collectors.toList())
                )
                .build();
    }
}
