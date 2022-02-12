package com.steam.library.dto.messages;


import com.steam.library.global.error.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorMessage {
    private String message;

    public static ErrorMessage of(ErrorCode errorCode) {
        return new ErrorMessage(errorCode.getMessage());
    }
}
