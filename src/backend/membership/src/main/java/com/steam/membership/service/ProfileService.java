package com.steam.membership.service;

import com.steam.membership.dto.UserDto;
import com.steam.membership.entity.GuestBook;
import com.steam.membership.entity.User;
import com.steam.membership.global.common.Body;
import com.steam.membership.global.error.ErrorCode;
import com.steam.membership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class ProfileService {
    private final UserRepository userRepository;

    public Object getUserProfile(Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty())
            return Body.error(ErrorCode.USER_NOT_FOUND);

        return UserDto.of(user.get());
    }

    public Object getFriendListRelatedMe(Integer userId) {

        return "";
    }

    public Object getGuestBooks(Integer userId) {
        List<GuestBook> 
        return "";
    }

    public Object writeGuestBook(Integer userId) {

        return "";
    }

    public Object patchGuestBook(Integer userId, Integer bookId, String content) {

        return "";
    }

    public Object deleteGuestBook(Integer userId, Integer bookId) {
        
        return "";
    }
}
