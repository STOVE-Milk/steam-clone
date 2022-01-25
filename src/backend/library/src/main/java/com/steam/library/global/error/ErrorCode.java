package com.steam.library.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    VALIDATION_FAILED(76100, "요청 데이터가 유효하지 않습니다."),

    JSON_PARSE_EXCEPTION(76802, "JSON 파싱 중 오류가 발생했습니다. 관리자에게 문의해주세요"),
    JWT_CLAIM_EXCEPTION(76803, "JWT 해석 중 오류가 발생했습니다. 관리자에게 문의해주세요"),

    SERVER_ERROR(76999, "예상하지 못한 문제가 발생했습니다. 관리자에게 문의해주세요");

    private final Integer code;
    private final String message;
}