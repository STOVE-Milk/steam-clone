package com.steam.membership.controller;

import com.steam.membership.global.common.Body;
import com.steam.membership.global.error.ErrorCode;
import com.steam.membership.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/membership/search")
public class SearchController {
    private final SearchService searchService;

    @GetMapping
    @ResponseBody
    public ResponseEntity<Body> searchUsers(
            @RequestParam(value = "nickname", required = false) String nickname,
            @RequestParam(value = "user_id", required = false) Integer userId,
            @RequestParam(value = "page", required = false) Integer page) {
        if(!nickname.isBlank()) {
            if(page == null || page <= 0)
                page = 0;
            else
                page--;

            return ResponseEntity.ok(
                    searchService.searchUsersByNickname(nickname, page)
            );
        } else if(userId != null) {
            return ResponseEntity.ok(
                    searchService.searchUserById(userId)
            );
        } else {
            return ResponseEntity.ok(
                    Body.error(ErrorCode.VALIDATION_FAILED, "nickname이나 user_id를 설정해주세요.")
            );
        }
    }
}
