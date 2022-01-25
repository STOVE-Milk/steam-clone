package com.steam.library.global.error;

import com.steam.library.global.common.Body;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(annotations = {RestController.class, Service.class})
@Order(10)
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Body> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        StringBuilder message = new StringBuilder();
        e.getAllErrors().forEach(s -> message.append(s.getDefaultMessage()).append('\n'));

        return ResponseEntity.ok(
                Body.error(ErrorCode.VALIDATION_FAILED, "요청 데이터들이 유효하지 않습니다.\n" + message)
        );
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Body> handleException(Exception e) {
        e.printStackTrace();
        return ResponseEntity.ok(
                Body.error(ErrorCode.SERVER_ERROR)
        );
    }

    @ExceptionHandler(RuntimeException.class)
    protected ResponseEntity<Body> handleRuntimeException(RuntimeException e) {
        e.printStackTrace();
        return ResponseEntity.ok(
                Body.error(ErrorCode.SERVER_ERROR)
        );
    }

}
