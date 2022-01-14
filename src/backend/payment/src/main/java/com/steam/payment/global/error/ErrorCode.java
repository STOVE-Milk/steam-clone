package com.steam.payment.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(77101, "유저 데이터를 불러오지 못했습니다."),

    JPA_JSON_CONVERTER_EXCEPTION(77301, "JPA JSON Converter Exception 발생"),

    KAKAOPAY_CACHE_DATA_NOT_FOUND(77490, "해당 결제 승인에 대한 데이터가 존재하지 않습니다."),
    KAKAOPAY_READY_FAILED(77491, "결제 준비 요청이 실패했습니다."),
    KAKAOPAY_APPROVAL_FAILED(77492, "결제 승인 요청이 실패했습니다."),
    KAKAOPAY_CANCEL_NOT_FOUND(77493, "결제 취소할 데이터가 없습니다."),


    USER_CHARGE_CANCLED(77801, "충전 중 오류가 발생해 결제 승인을 취소합니다. 관리자에게 문의해주세요"),
    REDIS_CONNECTION_FAILED(77901, "캐시 서버 연결에 실패했습니다. 관리자에게 문의해주세요");

    private final Integer code;
    private final String message;
}
