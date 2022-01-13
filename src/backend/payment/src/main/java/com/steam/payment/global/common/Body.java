package com.steam.payment.global.common;

import com.steam.payment.global.error.ErrorCode;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Builder
@Getter
public class Body<T> {
    private Integer code;
    private String message;
    private T data;

    public static <T> Body<Object> success(T data) {
        return Body.builder()
                .code(1)
                .message("성공")
                .data(data)
                .build();
    }

    public static <T> Body<Object> error(ErrorCode errorCode) {
        return Body.builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .data(new EmptyData())
                .build();
    }
}
