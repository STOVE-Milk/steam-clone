package com.steam.membership.global.error;

import com.steam.membership.global.common.Body;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(annotations = {RestController.class, Service.class})
@Order(10)
public class CustomExceptionHandler {
    @ExceptionHandler(CustomException.class)
    protected ResponseEntity<Body<Object>> handleCustomException(CustomException e) {
        e.printStackTrace();
        return ResponseEntity.ok(
                Body.error(e.getErrorCode())
        );
    }
}

