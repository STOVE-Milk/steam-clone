package com.steam.membership.dto;

import com.steam.membership.entity.Friend;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
public class SearchUserResponse {
    private List<UserDto> users;

    public static SearchUserResponse of(final List<UserWithIsFriend> users) {
        return SearchUserResponse.builder()
                .users(
                        users.stream()
                                .map(UserDto::of)
                                .collect(Collectors.toList())
                ).build();
    }
}
