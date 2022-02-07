package com.steam.payment.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Getter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ChargeApproveRequest {
    @NotBlank(message = "결제 id(tid)가 존재하지 않습니다.")
    private String tid;

    @NotBlank(message = "결제 토큰이 존재하지 않습니다.")
    private String pgToken;
}
