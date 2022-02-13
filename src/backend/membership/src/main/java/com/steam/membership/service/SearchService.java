package com.steam.membership.service;

import com.steam.membership.dto.UserDto;
import com.steam.membership.dto.UserWithIsFriend;
import com.steam.membership.entity.Friend;
import com.steam.membership.entity.User;
import com.steam.membership.global.common.Body;
import com.steam.membership.global.common.EmptyData;
import com.steam.membership.global.common.UserContext;
import com.steam.membership.repository.FriendRepository;
import com.steam.membership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class SearchService {
    private final UserRepository userRepository;
    private final FriendRepository friendRepository;

    public Body<Object> searchUserById(Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty())
            return Body.success(new EmptyData());

        Optional<Friend> friend = friendRepository.findByUserAndFriend(UserContext.getUser(), user.get());

        return Body.success(UserDto.of(user.get(), friend.isPresent()));
    }

    public Body<Object> searchUsersByNickname(String nickname, Integer page) {
        Integer start = page * 20;
        List<UserWithIsFriend> users;
        if(UserContext.isLogined()) {
            users = userRepository.findAllByNicknameStartsWith(UserContext.getUserId(), nickname, start, 20);
        } else {
            users = userRepository.findAllByNicknameStartsWith(nickname, start, 20);
        }

        return Body.success(SearchUserResponse.of(users));
    }
}
