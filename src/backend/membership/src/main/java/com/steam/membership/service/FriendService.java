package com.steam.membership.service;

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
import com.steam.membership.repository.FriendRepository;
import com.steam.membership.repository.FriendRequestRepository;
import com.steam.membership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

        if(friends.isEmpty())
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

        return Body.success(FriendsResponse.of(friends));
    }

    public Body<Object> getFriendListRelatedMe(Integer userId) {
        final List<Friend> myFriends = friendRepository.findAllByUser(UserContext.getUser());
        final List<User> usersFriends = friendRepository.findAllByUser(UserContext.getUser()).stream()
                .map(Friend::getFriend)
                .collect(Collectors.toList());

        if(myFriends.isEmpty() || usersFriends.isEmpty())
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

        List<UserDto> sameFriends = myFriends.stream()
                .map(Friend::getFriend)
                .filter(usersFriends::contains)
                .map(UserDto::of)
                .collect(Collectors.toList());

        return Body.success(FriendsResponse.builder().friends(sameFriends).build());
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

    public Body<Object> deleteFriend(Integer friendId) {
        // TODO 한쪽만 친구를 끊을 것인가?
        final Integer userId = UserContext.getUserId();
        final List<Friend> friend = friendRepository.findFriendsByUserIdAndFriendId(userId, friendId);

        if(friend == null)
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

        friendRepository.deleteAll(friend);

        return Body.success(new EmptyData());
    }

    public Body<Object> getFriendRequestList(String type) {
        final User me = UserContext.getUser();
        List<FriendRequest> friendRequests;

        if(type.equals(FRIEND_REQUEST_TYPE_SENDED)) {
            friendRequests = friendRequestRepository.findAllBySender(me);

            if(friendRequests.isEmpty())
                return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

            return Body.success(FriendRequestResponse.receiverOf(friendRequests));
        } else if(type.equals(FRIEND_REQUEST_TYPE_RECEIVED)) {
            friendRequests = friendRequestRepository.findAllByReceiver(me);

            if(friendRequests.isEmpty())
                return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

            return Body.success(FriendRequestResponse.senderOf(friendRequests));
        } else {
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);
        }
    }

    public Body<Object> sendFriendRequest(Integer userId) {
        final User me = UserContext.getUser();
        final Optional<User> receiver = userRepository.findById(userId);

        if(receiver.isEmpty())
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

        final Optional<FriendRequest> friendRequest = friendRequestRepository.findBySenderAndReceiver(me, receiver.get());
        if(friendRequest.isPresent())
            return Body.error(ErrorCode.ALREADY_REQUESTED);

        final Optional<Friend> friend = friendRepository.findByUserAndFriend(me, receiver.get());
        if(friend.isPresent())
            return Body.error(ErrorCode.ALREADY_FRIEND);

        friendRequestRepository.save(FriendRequest.builder().sender(me).receiver(receiver.get()).build());

        return Body.success(new EmptyData());
    }

    public Body<Object> rejectFriendRequest(Integer requestId) {
        final User me = UserContext.getUser();
        final Optional<FriendRequest> friendRequest = friendRequestRepository.findByIdAndUser(requestId, me);

        if(friendRequest.isEmpty())
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

        friendRequestRepository.delete(friendRequest.get());
        return Body.success(new EmptyData());
    }
}
