package com.steam.membership.service;

import com.steam.membership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Service
public class FriendService {
    private final UserRepository userRepository;

    public Object getFriendsList() {

        return "";
    }

    public Object acceptFriendRequest(Integer requestId) {

        return "";
    }

    public Object deleteFriend(Integer friendId) {
        return "";
    }

    public Object getFriendsList(String type) {
        return "";
    }

    public Object rejectFriendRequest(Integer requestId) {
        return "";
    }
}
