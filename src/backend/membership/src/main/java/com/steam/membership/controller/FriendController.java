package com.steam.membership.controller;

import com.steam.membership.service.FriendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/membership")
public class FriendController {
    private final FriendService friendService;

    @GetMapping("/friends")
    @ResponseBody
    public ResponseEntity<Object> getFriendsList() {

        return ResponseEntity.ok("");
    }

    @PostMapping("/friends")
    @ResponseBody
    public ResponseEntity<Object> acceptFriendRequest(@RequestParam("request_id") Integer requestId) {

        return ResponseEntity.ok("");
    }

    @DeleteMapping("/friends/{firendId}")
    @ResponseBody
    public ResponseEntity<Object> deleteFriend(@PathVariable("friendId") Integer friendId) {
        return ResponseEntity.ok(friendId);
    }

    @GetMapping("/friend-requests")
    @ResponseBody
    public ResponseEntity<Object> getFriendsList(@RequestParam("type") String type) {
        if(type.equals("sended"))
            return ResponseEntity.ok("");
        else if(type.equals("received"))
            return ResponseEntity.ok("");
        else
            return ResponseEntity.ok("");
    }

    @DeleteMapping("/friend-requests/{requestId}")
    @ResponseBody
    public ResponseEntity<Object> rejectFriendRequest(@PathVariable("requestId") Integer requestId) {
        return ResponseEntity.ok("");
    }


}
