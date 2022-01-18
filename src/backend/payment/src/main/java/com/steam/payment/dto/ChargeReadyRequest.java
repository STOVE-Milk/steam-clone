package com.steam.payment.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.payment.entity.mongodb.ChargeDoc;
import com.steam.payment.entity.mongodb.ChargeLogDoc;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

@Getter
public class ChargeReadyRequest {
    @NotNull
    private String method;

    @NotNull
    private GiftcardDto giftcard;

    public ChargeDoc toDocument() {
        return ChargeDoc.builder()
                .method(this.method)
                .giftcard(giftcard)
                .status("READY")
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
    }
}
