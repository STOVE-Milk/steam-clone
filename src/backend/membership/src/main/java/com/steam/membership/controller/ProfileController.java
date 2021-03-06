package com.steam.membership.controller;


import com.steam.membership.dto.GuestBookDto;
import com.steam.membership.service.FriendService;
import com.steam.membership.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

@RequiredArgsConstructor
@RestController
@RequestMapping("/membership/profile")
public class ProfileController {
    private final ProfileService profileService;
    private final FriendService friendService;
    
    @GetMapping("/{userId}")
    @ResponseBody
    public ResponseEntity<Object> getUserProfile(
            @NotBlank @PathVariable("userId") Integer userId) {

        return ResponseEntity.ok(
                profileService.getUserProfile(userId)
        );
    }

    @GetMapping("/{userId}/friends")
    @ResponseBody
    public ResponseEntity<Object> getFriendListRelatedMe(
            @NotBlank @PathVariable("userId") Integer userId) {

        return ResponseEntity.ok(
                friendService.getFriendListRelatedMe(userId)
        );
    }

    @GetMapping("/{userId}/guest-book")
    @ResponseBody
    public ResponseEntity<Object> getGuestBooks(
            @NotBlank @PathVariable("userId") Integer userId,
            @RequestParam(value = "page", required = false) Integer page) {
        if(page == null || page <= 0)
            page = 0;
        else
            page--;

        return ResponseEntity.ok(
                profileService.getGuestBooks(userId, page)
        );
    }

    @PostMapping("/{userId}/guest-book")
    @ResponseBody
    public ResponseEntity<Object> writeGuestBook(
            @NotEmpty @PathVariable("userId") Integer userId,
            @NotBlank @RequestBody GuestBookDto guestbook) {

        return ResponseEntity.ok(
                profileService.writeGuestBook(userId, guestbook.getContent())
        );
    }

    @PatchMapping("/{userId}/guest-book/{bookId}")
    @ResponseBody
    public ResponseEntity<Object> patchGuestBook(
            @NotEmpty @PathVariable("userId") Integer userId,
            @NotEmpty @PathVariable("bookId") Integer bookId,
            @NotBlank @RequestBody GuestBookDto guestbook) {
        return ResponseEntity.ok(
                profileService.patchGuestBook(userId, bookId, guestbook.getContent())
        );
    }

    @DeleteMapping("/{userId}/guest-book/{bookId}")
    @ResponseBody
    public ResponseEntity<Object> deleteGuestBook(
            @NotEmpty @PathVariable("userId") Integer userId,
            @NotEmpty @PathVariable("bookId") Integer bookId) {
        return ResponseEntity.ok(
                profileService.deleteGuestBook(userId, bookId)
        );
    }
}