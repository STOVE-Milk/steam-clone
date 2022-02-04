package com.steam.library.global.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.function.Supplier;

@Getter
@AllArgsConstructor
public class CustomException extends RuntimeException {
    private ErrorCode errorCode;

    public static CustomException withCode(ErrorCode errorCode) {
        return new CustomException(errorCode);
    }
}
