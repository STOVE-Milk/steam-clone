package com.steam.library.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    MESSAGE_PARSE_UNAVAILABLE(76100, "메시지 형식이 옳지 않습니다. 해석할 수 없습니다."),
    CONNECT_TO_OTHER_ROOM(76101, "다른 방에 접속하여, 해당 세션을 종료합니다."),

    UNAUTHORIZED(76401, "유저 인증에 실패했습니다. 재접속 해주세요"),
    NO_PERMISSION(76403, "권한이 없습니다."),

    JSON_PARSE_EXCEPTION(76802, "JSON 파싱 중 오류가 발생했습니다. 관리자에게 문의해주세요"),
    JWT_CLAIM_EXCEPTION(76803, "JWT 해석 중 오류가 발생했습니다. 관리자에게 문의해주세요"),

    NOT_ALLOWED_BEHAVIOR_CODE(76900, "지원하지 않는 메세지 형식입니다."),
    NULL_POINTER_ERROR(76998, "서버에서 NULL 데이터를 참조했습니다. 관리자에게 문의해주세요"),
    SERVER_ERROR(76999, "예상하지 못한 문제가 발생했습니다. 관리자에게 문의해주세요");

    private final Integer code;
    private final String message;
}