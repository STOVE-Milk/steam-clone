package com.steam.payment.dto.kakaopay;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;

public class KakaoPayHeader extends HttpHeaders {
    public KakaoPayHeader(String accessToken) {
        this.set("Authorization", "KakaoAK " + accessToken);
        this.setAccept(List.of(MediaType.ALL));
        this.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
    }
}
