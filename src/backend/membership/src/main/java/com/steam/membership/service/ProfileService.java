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

/*
    결제 서버와는 다르게 데이터가 비어있는 경우와 같은 예외상황에 대한 Response 처리를
    Throw가 아닌 ErrorBody를 만들어 리턴합니다. Jmeter를 이용해 테스트해봤을 때의 TPS가
    Throw를 통한 ExceptionHandler 처리와 비교해서 10퍼센트 더 빨라지는 결과를 얻었습니다.
*/
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

        boolean isFriend = false;
        if(UserContext.isLogined()) {
            final Optional<Friend> friend = friendRepository.findByUserAndFriend(user.get(), UserContext.getUser());
            isFriend = friend.isPresent();
        }

        return Body.success(UserDto.of(user.get(), isFriend));
    }

    public Body<Object> getGuestBooks(Integer userId, Integer page) {
        final List<GuestBook> guestBooks = guestBookRepository.findAllByUser(
                User.builder().idx(userId).build(),
                PageRequest.of(page, 20, Sort.by(Sort.Direction.DESC, "createdAt"))
        );

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
