package com.steam.payment.dto.kakaopay;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.payment.entity.redis.KakaoPayReadyCache;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class KakaoPayCancel {
    private String tid;
    private String cid;
    private Integer cancleAmount;
    private Integer cancleTaxFreeAmount;

    public static KakaoPayCancel of(KakaoPayReadyCache cache) {
        return KakaoPayCancel.builder()
                .cid(cache.getCid())
                .tid(cache.getTid())
                .cancleAmount(cache.getTotalAmount())
                .cancleTaxFreeAmount(cache.getTaxFreeAmount())
                .build();
    }
}
