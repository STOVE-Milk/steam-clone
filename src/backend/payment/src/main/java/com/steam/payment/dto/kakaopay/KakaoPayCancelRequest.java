package com.steam.payment.dto.kakaopay;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.payment.entity.redis.KakaoPayReadyCache;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class KakaoPayCancelRequest {
    private String tid;
    private String cid;
    private Integer cancleAmount;
    private Integer cancleTaxFreeAmount;

    public static KakaoPayCancelRequest of(KakaoPayReadyCache cache) {
        return KakaoPayCancelRequest.builder()
                .cid(cache.getCid())
                .tid(cache.getTid())
                .cancleAmount(cache.getTotalAmount())
                .cancleTaxFreeAmount(cache.getTaxFreeAmount())
                .build();
    }
}
