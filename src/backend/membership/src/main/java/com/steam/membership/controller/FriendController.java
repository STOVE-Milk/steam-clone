package com.steam.membership.controller;

import com.steam.membership.dto.RequestId;
import com.steam.membership.dto.UserDto;
import com.steam.membership.dto.UserId;
import com.steam.membership.service.FriendService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.*;

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
    public ResponseEntity<Object> acceptFriendRequest(
            @Valid
            @Min(value = 1, message = "요청 url의 최소값은 1입니다.")
            @Pattern(regexp = "^[0-9]+", message = "숫자만 입력 가능합니다")
            @RequestBody RequestId request) {

        return ResponseEntity.ok(
                friendService.acceptFriendRequest(request.getRequestId())
        );
    }

    @DeleteMapping("/friends/{friendId}")
    @ResponseBody
    public ResponseEntity<Object> deleteFriend(
            @Valid
            @Min(value = 1, message = "요청 url의 최소값은 1입니다.")
            @Pattern(regexp = "^[0-9]+", message = "숫자만 입력 가능합니다")
            @PathVariable("friendId") Integer friendId) {
        return ResponseEntity.ok(
                friendService.deleteFriend(friendId)
        );
    }

    @GetMapping("/friend-requests")
    @ResponseBody
    public ResponseEntity<Object> getFriendRequestList(
            @Valid
            @NotBlank
            @Pattern(regexp = "^[sended|received]", message = "파라미터 type은 'sended' 혹은 'received'만 가능합니다.")
            @RequestParam("type") String type) {
        return ResponseEntity.ok(
                friendService.getFriendRequestList(type)
        );
    }

    @PostMapping("/friend-requests")
    @ResponseBody
    public ResponseEntity<Object> sendFriendRequest(
            @Valid
            @Min(value = 1, message = "요청 url의 최소값은 1입니다.")
            @Pattern(regexp = "^[0-9]+", message = "숫자만 입력 가능합니다")
            @RequestBody UserId user) {
        return ResponseEntity.ok(
                friendService.sendFriendRequest(user.getUserId())
        );
    }

    @DeleteMapping("/friend-requests/{userId}")
    @ResponseBody
    public ResponseEntity<Object> rejectFriendRequest(
            @Valid
            @Min(value = 1, message = "요청 url의 최소값은 1입니다.")
            @Pattern(regexp = "^[0-9]+", message = "숫자만 입력 가능합니다")
            @PathVariable("userId") Integer userId) {
        return ResponseEntity.ok(
                friendService.rejectFriendRequest(userId)
        );
    }


}
