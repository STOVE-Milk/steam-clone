package com.steam.payment.dto.kakaopay;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.payment.entity.redis.KakaoPayReadyCache;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class KakaoPayApproveRequest {
    private String cid;
    private String tid;
    private String partnerOrderId;
    private String partnerUserId;
    private String pgToken;
    private String payload;

    public static KakaoPayApproveRequest of(KakaoPayReadyCache cache, String pgToken) {
        return KakaoPayApproveRequest.builder()
                .cid(cache.getCid())
                .tid(cache.getTid())
                .partnerOrderId(cache.getPartnerOrderId())
                .partnerUserId(cache.getPartnerUserId())
                .pgToken(pgToken)
                .payload("test")
                .build();
    }
}
