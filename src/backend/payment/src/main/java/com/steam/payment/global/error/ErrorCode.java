package com.steam.payment.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    KAKAOPAY_DATA_NOT_FOUND(77490, "해당 결제 승인에 대한 데이터가 존재하지 않습니다."),
    KAKAOPAY_READY_FAILED(77491, "결제 준비 요청이 실패했습니다."),
    KAKAOPAY_APPROVAL_FAILED(77492, "결제 승인 요청이 실패했습니다."),

    USER_NOT_FOUND(77001, "유저 데이터를 불러오지 못했습니다.");


    private final Integer code;
    private final String message;
}
