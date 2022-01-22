package com.steam.membership.controller;

import com.steam.membership.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@RequiredArgsConstructor
@RestController
@RequestMapping("/membership")
public class FriendController {
    private final FriendService friendService;

    @GetMapping("/friends")
    @ResponseBody
    public ResponseEntity<Object> getFriendList() {

        return ResponseEntity.ok(
                friendService.getFriendList()
        );
    }

    @PostMapping("/friends")
    @ResponseBody
    public ResponseEntity<Object> acceptFriendRequest(@NotNull @RequestParam("request_id") Integer requestId) {

        return ResponseEntity.ok(
                friendService.acceptFriendRequest(requestId)
        );
    }

    @DeleteMapping("/friends/{firendId}")
    @ResponseBody
    public ResponseEntity<Object> deleteFriend(@NotBlank @PathVariable("friendId") Integer friendId) {
        return ResponseEntity.ok(
                friendService.deleteFriend(friendId)
        );
    }

    @GetMapping("/friend-requests")
    @ResponseBody
    public ResponseEntity<Object> getFriendRequestList(@NotBlank @RequestParam("type") String type) {
        return ResponseEntity.ok(
                friendService.getFriendRequestList(type)
        );
    }

    @PostMapping("/friend-requests")
    @ResponseBody
    public ResponseEntity<Object> sendFriendRequest(@NotBlank @RequestParam("userId") Integer userId) {
        return ResponseEntity.ok(
                friendService.sendFriendRequest(userId)
        );
    }

    @DeleteMapping("/friend-requests/{requestId}")
    @ResponseBody
    public ResponseEntity<Object> rejectFriendRequest(@NotBlank @PathVariable("requestId") Integer requestId) {
        return ResponseEntity.ok(
                friendService.rejectFriendRequest(requestId)
        );
    }


}
