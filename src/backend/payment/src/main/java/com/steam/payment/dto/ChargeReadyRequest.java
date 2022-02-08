package com.steam.payment.dto;

import com.steam.payment.entity.mongodb.ChargeLog;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Getter
public class ChargeReadyRequest {
    @NotBlank(message = "결제 수단을 선택해주세요")
    private String method;

    @NotNull(message = "상품권을 선택해주세요")
    private GiftcardDto giftcard;

    public ChargeLog toLog() {
        return ChargeLog.builder()
                .method(this.method)
                .giftcard(giftcard)
                .status("READY")
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
    }

    public ChargeLog toLog(GiftcardDto giftcardDto) {
        return ChargeLog.builder()
                .method(this.method)
                .giftcard(giftcardDto)
                .status("READY")
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
    }
}
