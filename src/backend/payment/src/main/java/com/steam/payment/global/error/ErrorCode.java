package com.steam.payment.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(77101, "유저 데이터를 불러오지 못했습니다."),

    GAME_PRICE_VALIDATION_FAILED(77201, "게임 정보가 일치하지 않습니다."),
    GAME_PRICE_ACCUMULATE_FAILED(77202, "게임 가격 계산 중 오류가 발생했습니다."),
    USER_MONEY_NOT_ENOUGH(77203, "돈이 충분하지 않습니다."),
    GAME_ALEADY_PURCHASED(77204, "이미 구매한 게임이 목록에 있습니다."),

    JPA_JSON_CONVERTER_EXCEPTION(77301, "JPA JSON Converter Exception 발생"),

    KAKAOPAY_CACHE_DATA_NOT_FOUND(77401, "해당 결제 승인에 대한 데이터가 존재하지 않습니다."),
    KAKAOPAY_READY_FAILED(77402, "결제 준비 요청이 실패했습니다."),
    KAKAOPAY_APPROVAL_FAILED(77403, "결제 승인 요청이 실패했습니다."),
    KAKAOPAY_CANCEL_NOT_FOUND(77404, "결제 취소할 데이터가 없습니다."),

    USER_CHARGE_CANCLED(77801, "충전 중 오류가 발생해 결제 승인을 취소합니다. 관리자에게 문의해주세요"),
    JSON_PARSE_EXCEPTION(77802, "JSON 파싱 중 오류가 발생했습니다. 관리자에게 문의해주세요"),
    JWT_CLAIM_EXCEPTION(77803, "JWT 해석 중 오류가 발생했습니다. 관리자에게 문의해주세요"),

    REDIS_CONNECTION_FAILED(77901, "캐시 서버 연결에 실패했습니다. 관리자에게 문의해주세요");

    private final Integer code;
    private final String message;
}
