package com.steam.membership.service;

import com.steam.membership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Service
public class ProfileService {
    private final UserRepository userRepository;

    public Object getUserProfile(Integer userId) {

        return "";
    }

    public Object getFriendListRelatedMe(Integer userId) {

        return "";
    }

    public Object getGuestBook(Integer userId) {

        return "";
    }

    public Object writeGuestBook(Integer userId) {

        return "";
    }

    public Object patchGuestBook(Integer userId, Integer bookId) {

        return "";
    }

    public Object deleteGuestBook(Integer userId, Integer bookId) {
        
        return "";
    }
}
