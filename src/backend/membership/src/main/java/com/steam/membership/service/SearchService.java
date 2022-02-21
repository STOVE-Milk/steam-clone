package com.steam.membership.service;

import com.steam.membership.dto.SearchUserResponse;
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

    /*
        nickname으로 시작하는 유저들 접근 시간 정렬로 20개 기준 page 검색
        로그인 되어 있을 경우 friend 테이블과 INNER JOIN하여 친구인지 판별을 합니다. 이를 위해 Interface Projection을 사용했습니다.
        하지만 현재 쿼리 결과상으로는 친구 여부가 잘 나오지만, Injection된 값은 다른 오류가 존재합니다. # 존재하지만 무조건 NULL로 판단하는 오류
        StartWith으로 검색한 이유는 String형 컬럼에 대한 인덱스의 경우 StartWith으로 검색해야 적용된다고 배워서 했습니다.
        유저 수가 적을 경우 인덱스 적용이 오히려 비효율적일 수 있지만, 많다는 가정하에 적용했습니다.
    */
    public Body<Object> searchUsersByNickname(String nickname, Integer page) {
        Integer start = page * 20;
        List<UserWithIsFriend> users;
        if(UserContext.isLoginedUser()) {
            users = userRepository.findAllByNicknameStartsWith(UserContext.getUserId(), nickname, start, 20);
        } else {
            users = userRepository.findAllByNicknameStartsWith(nickname, start, 20);
        }

        return Body.success(SearchUserResponse.of(users));
    }
}
