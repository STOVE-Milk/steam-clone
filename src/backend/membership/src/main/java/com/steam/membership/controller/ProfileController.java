package com.steam.membership.controller;


import com.steam.membership.service.FriendService;
import com.steam.membership.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/membership/profile")
public class ProfileController {
    private final ProfileService profileService;
    private final FriendService friendService;

    @GetMapping("/{userId}}")
    @ResponseBody
    public ResponseEntity<Object> getUserProfile(@PathVariable("userId") Integer userId) {

        return ResponseEntity.ok(
                profileService.getUserProfile(userId)
        );
    }

    @GetMapping("/{userId}/friends")
    @ResponseBody
    public ResponseEntity<Object> getFriendListRelatedMe(@PathVariable("userId") Integer userId) {

        return ResponseEntity.ok(
                friendService.getFriendListRelatedMe(userId)
        );
    }

    @GetMapping("/{userId}/guest-book")
    @ResponseBody
    public ResponseEntity<Object> getGuestBooks(@PathVariable("userId") Integer userId, @RequestParam("page") Integer page) {

        return ResponseEntity.ok(
                profileService.getGuestBooks(userId)
        );
    }

    @PostMapping("/{userId}/guest-book")
    @ResponseBody
    public ResponseEntity<Object> writeGuestBook(@PathVariable("userId") Integer userId) {

        return ResponseEntity.ok(
                profileService.writeGuestBook(userId)
        );
    }

    @PatchMapping("/{userId}/guest-book/{bookId}")
    @ResponseBody
    public ResponseEntity<Object> patchGuestBook(
            @PathVariable("userId") Integer userId,
            @PathVariable("bookId") Integer bookId,
            @RequestParam("content") String content) {
        return ResponseEntity.ok(
                profileService.patchGuestBook(userId, bookId, content)
        );
    }

    @DeleteMapping("/{userId}/guest-book/{bookId}")
    @ResponseBody
    public ResponseEntity<Object> deleteGuestBook(@PathVariable("userId") Integer userId, @PathVariable("bookId") Integer bookId) {
        return ResponseEntity.ok(
                profileService.deleteGuestBook(userId, bookId)
        );
    }
}