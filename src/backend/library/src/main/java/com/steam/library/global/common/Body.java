package com.steam.library.global.common;

import com.steam.library.global.error.ErrorCode;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class Body<T> {
    private Integer code;
    private String message;
    private T data;

    public static <T> Body<Object> success(T data) {
        return Body.builder()
                .code(76000)
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