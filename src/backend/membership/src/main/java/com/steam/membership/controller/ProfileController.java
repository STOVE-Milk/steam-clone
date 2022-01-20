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

    @GetMapping("/{userId}}")
    @ResponseBody
    public ResponseEntity<Object> getUserProfile(@PathVariable("userId") Integer userId) {

        return ResponseEntity.ok("");
    }

    @GetMapping("/{userId}/friends")
    @ResponseBody
    public ResponseEntity<Object> getFriendListRelatedMe(@PathVariable("userId") Integer userId) {

        return ResponseEntity.ok("");
    }

    @GetMapping("/{userId}/guest-book")
    @ResponseBody
    public ResponseEntity<Object> getGuestBooks(@PathVariable("userId") Integer userId, @RequestParam("page") Integer page) {

        return ResponseEntity.ok("");
    }

    @PostMapping("/{userId}/guest-book")
    @ResponseBody
    public ResponseEntity<Object> writeGuestBook(@PathVariable("userId") Integer userId) {

        return ResponseEntity.ok("");
    }

    @PatchMapping("/{userId}/guest-book/{bookId}")
    @ResponseBody
    public ResponseEntity<Object> patchGuestBook(@PathVariable("userId") Integer userId, @PathVariable("bookId") Integer bookId) {
        return ResponseEntity.ok("");
    }

    @DeleteMapping("/{userId}/guest-book/{bookId}")
    @ResponseBody
    public ResponseEntity<Object> deleteGuestBook(@PathVariable("userId") Integer userId, @PathVariable("bookId") Integer bookId) {
        return ResponseEntity.ok("");
    }
}