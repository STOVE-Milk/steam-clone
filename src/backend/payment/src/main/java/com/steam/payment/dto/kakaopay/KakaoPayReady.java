package com.steam.payment.dto.kakaopay;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.entity.redis.KakaoPayReadyCache;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class KakaoPayReady{
    private String cid;
    private String partnerOrderId;
    private String partnerUserId;
    private String itemName;
    private String itemCode;
    private Integer quantity;
    private Integer totalAmount;
    private Integer taxFreeAmount;
    private Integer vat;
    private String approvalUrl;
    private String cancelUrl;
    private String failUrl;

    public static KakaoPayReady of(Integer userId, GiftcardDto giftcard, Integer orderCount) {
        return KakaoPayReady.builder()
                .itemCode(giftcard.getId().toString())
                .itemName(giftcard.getName())
                .partnerOrderId(userId.toString() + "-" + orderCount.toString())
                .partnerUserId(userId.toString())
                .quantity(1)
                .totalAmount(giftcard.getPrice())
                .taxFreeAmount(0)
                .vat(0)
                .build();
    }

    public KakaoPayReadyCache toHashWithTid(String tid) {
        return KakaoPayReadyCache.builder()
                .cid(this.cid)
                .tid(tid)
                .partnerOrderId(this.partnerOrderId)
                .partnerUserId(this.partnerUserId)
                .totalAmount(this.totalAmount)
                .taxFreeAmount(this.taxFreeAmount)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
