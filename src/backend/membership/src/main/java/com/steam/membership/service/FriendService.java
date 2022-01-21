package com.steam.membership.service;

import com.steam.membership.dto.FriendsResponse;
import com.steam.membership.entity.Friend;
import com.steam.membership.entity.FriendRequest;
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
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class FriendService {
    private final UserRepository userRepository;
    private final FriendRepository friendRepository;
    private final FriendRequestRepository friendRequestRepository;

    public FriendsResponse getFriendList() {
        return FriendsResponse.of(
                userRepository.findTop10ByIdxOrderByAccessedAtDesc(UserContext.getUserId())
        );
    }

    @Transactional
    public Body<Object> acceptFriendRequest(Integer requestId) {
        Integer userId = UserContext.getUserId();
        Optional<FriendRequest> friendRequest = friendRequestRepository.findByIdAndReceiverId(requestId, userId);
        if(friendRequest.isEmpty())
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);
        List<Friend> friends = List.of(
                Friend.builder()
                .userId(userId)
                .friendId(friendRequest.get().getSenderId())
                .build(),
                Friend.builder()
                .userId(friendRequest.get().getSenderId())
                .friendId(userId)
                .build()
        );
        friendRequestRepository.delete(friendRequest.get());
        friendRepository.saveAll(friends);
        return Body.success(new EmptyData());
    }

    public Body<Object> deleteFriend(Integer friendId) {
        // TODO 한쪽만 친구를 끊을 것인가?
        Integer userId = UserContext.getUserId();
        List<Friend> friend = friendRepository.findFriendsByUserIdAndFriendId(userId, friendId);
        if(friend == null)
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);
        friendRepository.deleteAll(friend);

        return Body.success(new EmptyData());
    }

    public Body<Object> getFriendRequestList(String type) {
        List<FriendRequest> friendRequests =
        return "";
    }

    public Body<Object> rejectFriendRequest(Integer requestId) {
        Integer userId = UserContext.getUserId();
        Optional<FriendRequest> friendRequest = friendRequestRepository.findByIdAndReceiverId(requestId, userId);
        if(friendRequest.isEmpty())
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);
        List<Friend> friends = List.of(
                Friend.builder()
                        .userId(userId)
                        .friendId(friendRequest.get().getSenderId())
                        .build(),
                Friend.builder()
                        .userId(friendRequest.get().getSenderId())
                        .friendId(userId)
                        .build()
        );
        friendRequestRepository.delete(friendRequest.get());
        friendRepository.saveAll(friends);
        return Body.success(new EmptyData());
    }
}
