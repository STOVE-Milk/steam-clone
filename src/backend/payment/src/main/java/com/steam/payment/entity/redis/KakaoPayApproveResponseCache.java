package com.steam.payment.entity.redis;


import com.steam.payment.dto.kakaopay.MoneyInfo;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Builder
@Data
@NoArgsConstructor(access = AccessLevel.PACKAGE)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@RedisHash(value = "kakaopay", timeToLive = 600)
public class KakaoPayApproveResponseCache {
    @Id
    private String aid;
    private String tid;
    private String cid;
    private Integer total;
    private Integer taxFree;
    private String createdAt;
    private String approvedAt;
}
