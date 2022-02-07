package com.steam.membership.dto;

import com.steam.membership.entity.Friend;
import com.steam.membership.entity.FriendRequest;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
public class FriendRequestResponse {
    List<UserDto> requests;

    public static FriendRequestResponse receiverOf(final List<FriendRequest> users) {
        return FriendRequestResponse.builder()
                .requests(
                        users.stream()
                                .map(request -> UserDto.of(request.getReceiver(), request.getCreatedAt()))
                                .collect(Collectors.toList())
                )
                .build();
    }
    public static FriendRequestResponse senderOf(final List<FriendRequest> users) {
        return FriendRequestResponse.builder()
                .requests(
                        users.stream()
                                .map(request -> UserDto.of(request.getSender(), request.getCreatedAt()))
                                .collect(Collectors.toList())
                )
                .build();
    }
}
