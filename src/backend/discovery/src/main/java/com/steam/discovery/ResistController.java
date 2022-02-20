package com.steam.discovery;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ResistController {
    @GetMapping("/regist")
    public String registService() {
        return "connect success";
    }
}
