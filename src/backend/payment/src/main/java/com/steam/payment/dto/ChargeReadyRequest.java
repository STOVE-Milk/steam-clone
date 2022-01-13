package com.steam.payment.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class ChargeReadyRequest {
    @NotNull
    private String method;

    @NotNull
    private GiftcardDto giftcard;
}
