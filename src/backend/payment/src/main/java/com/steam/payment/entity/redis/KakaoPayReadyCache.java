package com.steam.payment.entity.redis;

import com.steam.payment.dto.kakaopay.KakaoPayReadyRequest;
import com.steam.payment.dto.kakaopay.KakaoPayReadyResponse;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor(access = AccessLevel.PACKAGE)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@RedisHash(value = "kakaopay", timeToLive = 600)
public class KakaoPayReadyCache {
    @Id
    private String tid;
    private String cid;
    private String pgToken;
    private String partnerOrderId;
    private String partnerUserId;
    private Integer totalAmount;
    private Integer taxFreeAmount;
    private LocalDateTime createdAt;

    public static KakaoPayReadyCache of(KakaoPayReadyRequest kakaoPayReadyRequest, KakaoPayReadyResponse kakaoPayReadyResponse) {
        return KakaoPayReadyCache.builder()
                .cid(kakaoPayReadyRequest.getCid())
                .tid(kakaoPayReadyResponse.getTid())
                .partnerOrderId(kakaoPayReadyRequest.getPartnerOrderId())
                .partnerUserId(kakaoPayReadyRequest.getPartnerUserId())
                .createdAt(LocalDateTime.now())
                .build();
    }
}
