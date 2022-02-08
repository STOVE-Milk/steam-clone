package com.steam.membership.service;

import com.steam.membership.dto.GuestBookResponse;
import com.steam.membership.dto.UserDto;
import com.steam.membership.entity.Friend;
import com.steam.membership.entity.GuestBook;
import com.steam.membership.entity.User;
import com.steam.membership.global.common.Body;
import com.steam.membership.global.common.EmptyData;
import com.steam.membership.global.common.UserContext;
import com.steam.membership.global.error.ErrorCode;
import com.steam.membership.repository.FriendRepository;
import com.steam.membership.repository.GuestBookRepository;
import com.steam.membership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class ProfileService {
    private final UserRepository userRepository;
    private final GuestBookRepository guestBookRepository;
    private final FriendRepository friendRepository;

    public Body<Object> getUserProfile(Integer userId) {
        final Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty())
            return Body.error(ErrorCode.USER_NOT_FOUND);

        final Optional<Friend> friend = friendRepository.findByUserAndFriend(user.get(), UserContext.getUser());

        return Body.success(UserDto.of(user.get(), friend.isPresent()));
    }

    public Body<Object> getGuestBooks(Integer userId, Integer page) {
        final List<GuestBook> guestBooks = guestBookRepository.findAllByUser(
                User.builder().idx(userId).build(),
                PageRequest.of(page, 20, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
//        if(guestBooks.isEmpty())
//            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);
        return Body.success(GuestBookResponse.of(guestBooks));
    }

    public Object writeGuestBook(Integer userId, String content) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty())
            return Body.error(ErrorCode.USER_NOT_FOUND);

        GuestBook newGuestBook = GuestBook.builder()
                .user(user.get())
                .displayedName(user.get().getNickname())
                .guest(UserContext.getUser())
                .content(content)
                .build();
        guestBookRepository.save(newGuestBook);

        return Body.success(new EmptyData());
    }

    public Object patchGuestBook(Integer userId, Integer bookId, String content) {
        final User me = UserContext.getUser();
        final User user = User.builder().idx(userId).build();

        Optional<GuestBook> guestBook = guestBookRepository.findGuestBookByIdxAndUserAndGuest(bookId, user, me);
        if(guestBook.isEmpty())
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

        guestBook.get().updateContent(content);
        guestBookRepository.save(guestBook.get());

        return Body.success(new EmptyData());
    }

    public Object deleteGuestBook(Integer userId, Integer bookId) {
        final User me = UserContext.getUser();
        final User user = User.builder().idx(userId).build();

        final Optional<GuestBook> guestBook = guestBookRepository.findGuestBookByIdxAndUserAndGuest(bookId, user, me);
        if(guestBook.isEmpty())
            return Body.error(ErrorCode.REQUEST_DATA_NOT_FOUND);

        guestBookRepository.delete(guestBook.get());

        return Body.success(new EmptyData());
    }
}
