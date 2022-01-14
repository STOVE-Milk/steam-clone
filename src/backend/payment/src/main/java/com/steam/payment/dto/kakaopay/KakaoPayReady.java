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
    private Integer tax_free_amount;
    private Integer vat;
    private String approvalUrl;
    private String cancelUrl;
    private String failUrl;

    public static KakaoPayReady of(GiftcardDto giftcard) {
        return KakaoPayReady.builder()
                .itemCode(giftcard.getId().toString())
                .itemName(giftcard.getName())
                .partnerOrderId("1")
                .partnerUserId("1")
                .quantity(1)
                .totalAmount(giftcard.getPrice())
                .tax_free_amount(0)
                .vat(0)
                .build();
    }

    public KakaoPayReadyCache toHashWithTid(String tid) {
        return KakaoPayReadyCache.builder()
                .cid(this.cid)
                .tid(tid)
                .partnerOrderId(this.partnerOrderId)
                .partnerUserId(this.partnerUserId)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
