package com.steam.payment.global.common;

import com.steam.payment.global.error.ErrorCode;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Builder
@Getter
public class Body<T> {
    // 서버에서 정한 코드
    private Integer code;
    // 서버에서 정한 메세지
    private String message;
    // 성공 시 Response Body 데이터
    private T data;

    public static <T> Body<Object> success(T data) {
        return Body.builder()
                .code(77000)
                .message("성공")
                .data(data)
                .build();
    }

    public static Body<Object> error(ErrorCode errorCode) {
        return Body.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .data(new EmptyData())
                .build();
    }
    public static Body<Object> error(ErrorCode errorCode, String message) {
        return Body.builder()
                .code(errorCode.getCode())
                .message(message)
                .data(new EmptyData())
                .build();
    }
}
