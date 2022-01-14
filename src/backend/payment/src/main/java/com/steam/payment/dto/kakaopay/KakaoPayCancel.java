package com.steam.payment.dto.kakaopay;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.payment.entity.redis.KakaoPayApproveResponseCache;
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

    public static KakaoPayCancel of(KakaoPayApproveResponseCache cache) {
        return KakaoPayCancel.builder()
                .cid(cache.getCid())
                .tid(cache.getTid())
                .cancleAmount(cache.getTotal())
                .cancleTaxFreeAmount(cache.getTaxFree())
                .build();
    }
}
