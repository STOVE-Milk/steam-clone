package com.steam.membership.global.error;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    VALIDATION_FAILED(75100, "요청 데이터가 유효하지 않습니다."),
    USER_NOT_FOUND(75101, "유저 데이터를 불러오지 못했습니다."),
    REQUEST_DATA_NOT_FOUND(75102, "이미 삭제되었거나, 없는 데이터를 요청했습니다."),
    ALREADY_REQUESTED(75103, "이미 보낸 요청입니다."),

    ALREADY_FRIEND(75201, "이미 친구 관계입니다."),

    JSON_PARSE_EXCEPTION(75802, "JSON 파싱 중 오류가 발생했습니다. 관리자에게 문의해주세요"),
    JWT_CLAIM_EXCEPTION(75803, "JWT 해석 중 오류가 발생했습니다. 관리자에게 문의해주세요"),

    SERVER_ERROR(75999, "예상하지 못한 문제가 발생했습니다. 관리자에게 문의해주세요");

    private final Integer code;
    private final String message;
}
