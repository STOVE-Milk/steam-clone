package com.steam.membership.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.steam.membership.dto.FriendRequestResponse;
import com.steam.membership.dto.FriendsResponse;
import com.steam.membership.dto.UserDto;
import com.steam.membership.entity.Friend;
import com.steam.membership.entity.FriendRequest;
import com.steam.membership.entity.User;
import com.steam.membership.global.common.Body;
import com.steam.membership.global.common.EmptyData;
import com.steam.membership.global.common.UserContext;
import com.steam.membership.global.error.CustomException;
import com.steam.membership.global.error.ErrorCode;
import com.steam.membership.global.util.JsonUtil;
import com.steam.membership.repository.FriendRepository;
import com.steam.membership.repository.FriendRequestRepository;
import com.steam.membership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/*
    결제 서버와는 다르게 데이터가 비어있는 경우와 같은 예외상황에 대한 Response 처리를
    Throw가 아닌 ErrorBody를 만들어 리턴합니다. Jmeter를 이용해 테스트해봤을 때의 TPS가
    Throw를 통한 ExceptionHandler 처리와 비교해서 10퍼센트 더 빨라지는 결과를 얻었습니다.
*/
@Slf4j
@RequiredArgsConstructor
@Service
public class FriendService {
    private final UserRepository userRepository;
    private final FriendRepository friendRepository;
    private final FriendRequestRepository friendRequestRepository;

    private static final String FRIEND_REQUEST_TYPE_SENDED = "sended";
    private static final String FRIEND_REQUEST_TYPE_RECEIVED = "received";

    public Body<Object> getFriendList() {
        final List<Friend> friends = friendRepository.findTop20ByUser(UserContext.getUser());

        return Body.success(FriendsResponse.of(friends));
    }

    public Body<Object> getFriendListRelatedMe(Integer userId) {
        final List<Friend> sameFriends = friendRepository.findFriendsTop20ByUserId(
                UserContext.getUserId(),
                userId
        );

        if(sameFriends.isEmpty())
            return Body.success(FriendsResponse.of(sameFriends));

        // TODO: N+1 문제 해결 - Lazy Fetch로 현재 유저를 하나씩 불러오게 됨
        // Id List를 뽑아 한꺼번에 SELECT 하도록 or 처음부터 Join해서 가져오기
        List<UserDto> userDatas = sameFriends.stream()
                .map(Friend::getFriend)
                .map(UserDto::of)
                .collect(Collectors.toList());

        return Body.success(FriendsResponse.builder().friends(userDatas).build());
    }

    @Transactional
    public Body<Object> acceptFriendRequest(Integer requestId) {
        final User me = UserContext.getUser();
        final User sender = User.builder().idx(requestId).build();

        Optional<FriendRequest> friendRequest = friendRequestRepository.findBySenderAndReceiver(sender, me);

        if(friendRequest.isEmpty())
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

        List<Friend> friends = List.of(
                Friend.builder()
                .user(me)
                .friend(sender)
                .build(),
                Friend.builder()
                .user(sender)
                .friend(me)
                .build()
        );

        friendRequestRepository.delete(friendRequest.get());
        friendRepository.saveAll(friends);

        return Body.success(new EmptyData());
    }

    @Transactional
    public Body<Object> deleteFriend(Integer friendId) {
        final Integer userId = UserContext.getUserId();
        final List<Friend> friend = friendRepository.findFriendsByUserIdAndFriendId(userId, friendId);

        if(friend.isEmpty())
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

        friendRepository.deleteAll(friend);

        return Body.success(new EmptyData());
    }

    public Body<Object> getFriendRequestList(String type) {
        final User me = UserContext.getUser();
        List<FriendRequest> friendRequests;

        if(type.equals(FRIEND_REQUEST_TYPE_SENDED)) {
            friendRequests = friendRequestRepository.findAllBySender(me);
            return Body.success(FriendRequestResponse.receiverOf(friendRequests));
        } else if(type.equals(FRIEND_REQUEST_TYPE_RECEIVED)) {
            friendRequests = friendRequestRepository.findAllByReceiver(me);
            return Body.success(FriendRequestResponse.senderOf(friendRequests));
        } else {
            return Body.success(FriendRequestResponse.builder().requests(new ArrayList<>()).build());
        }
    }

    @Transactional
    public Body<Object> sendFriendRequest(Integer userId) {
        final User me = UserContext.getUser();
        final Optional<User> receiver = userRepository.findById(userId);

        if(receiver.isEmpty())
            return Body.success(new EmptyData());

        final Optional<FriendRequest> friendRequest = friendRequestRepository.findBySenderAndReceiver(me, receiver.get());
        if(friendRequest.isPresent())
            return Body.error(ErrorCode.ALREADY_REQUESTED);

        final Optional<Friend> friend = friendRepository.findByUserAndFriend(me, receiver.get());
        if(friend.isPresent())
            return Body.error(ErrorCode.ALREADY_FRIEND);

        friendRequestRepository.save(FriendRequest.builder().sender(me).receiver(receiver.get()).build());

        return Body.success(new EmptyData());
    }

    @Transactional
    public Body<Object> rejectFriendRequest(Integer userId) {
        final Optional<FriendRequest> friendRequest = friendRequestRepository.findByUserIdAndMyId(userId, UserContext.getUserId());

        if(friendRequest.isEmpty())
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

        friendRequestRepository.delete(friendRequest.get());
        return Body.success(new EmptyData());
    }
}
