package com.steam.payment.dto.kakaopay;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.payment.entity.redis.KakaoPayApproveResponseCache;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class KakaoPayApproveResponse {
    private String aid;
    private String tid;
    private String cid;
    private String partnerOrderId;
    private String partnerUserId;
    private String paymentMethodType;
    private String itemName;
    private Integer quentity;
    private MoneyInfo amount;
    private String createdAt;
    private String approvedAt;

    public KakaoPayApproveResponseCache toHash() {
        return KakaoPayApproveResponseCache.builder()
                .aid(this.aid)
                .tid(this.tid)
                .cid(this.cid)
                .total(this.amount.getTotal())
                .taxFree(this.amount.getTaxFree())
                .createdAt(this.createdAt)
                .approvedAt(this.approvedAt)
                .build();
    }

}
