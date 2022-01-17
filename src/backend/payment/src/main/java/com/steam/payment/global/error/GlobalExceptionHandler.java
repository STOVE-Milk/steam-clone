package com.steam.payment.global.error;

import com.steam.payment.global.common.Body;
import com.steam.payment.global.common.EmptyData;
import org.springframework.core.annotation.Order;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.net.BindException;
import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice(annotations = {RestController.class, Service.class})
@Order(10)
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Body> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        StringBuilder message = new StringBuilder();
        e.getAllErrors().forEach(s -> message.append(s.getDefaultMessage()).append('\n'));

        return ResponseEntity.ok(
                Body.builder()
                        .code(77100)
                        .message("요청 데이터들이 유효하지 않습니다.\n" + message)
                        .data(new EmptyData())
                        .build()
        );
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<String> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        e.printStackTrace();
        return ResponseEntity.ok("요청의 파라미터 타입이 일치하지 않습니다. 관리자에게 문의바랍니다.");
    }

    @ExceptionHandler(MissingPathVariableException.class)
    protected ResponseEntity<String> handleMissingPathVariableException(MissingPathVariableException e) {
        e.printStackTrace();
        return ResponseEntity.ok("공백이 포함된 url로 인해 오류가 발생했습니다.");
    }

    @ExceptionHandler(NullPointerException.class)
    protected ResponseEntity<String> handleNullPointerException(NullPointerException e) {
        e.printStackTrace();
        return ResponseEntity.ok("서버에서 비어있는 객체를 호출했습니다. 관리자에게 문의바랍니다.");
    }

    @ExceptionHandler(BindException.class)
    protected ResponseEntity<String> handleBindException(BindException e) {
        e.printStackTrace();
        return ResponseEntity.ok("특정 포트가 이미 사용중입니다. 관리자에게 문의바랍니다.");
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    protected ResponseEntity<String> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        e.printStackTrace();
        return ResponseEntity.ok("특정 요청 메소드를 지원하지 않습니다. 관리자에게 문의바랍니다.");
    }

    @ExceptionHandler(AccessDeniedException.class)
    protected ResponseEntity<String> handleAccessDeniedException(AccessDeniedException e) {
        e.printStackTrace();
        return ResponseEntity.ok("서버에서 허용되지 않는 데이터에 접근을 시도했습니다. 관리자에게 문의바랍니다.");
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    protected ResponseEntity<String> handleNoHandlerFoundException(NoHandlerFoundException e) {
        e.printStackTrace();
        return ResponseEntity.ok("서버에서 지원하지 않는 요청입니다. 관리자에게 문의바랍니다.");
    }

    @ExceptionHandler(RedisConnectionFailureException.class)
    protected ResponseEntity<Body<Object>> handleRedisConnectionFailureException(RedisConnectionFailureException e) {
        e.printStackTrace();
        return ResponseEntity.ok(
                Body.error(ErrorCode.REDIS_CONNECTION_FAILED)
        );
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace();
        return ResponseEntity.ok("서버에서 예상하지 못한 오류가 발생했습니다. 관리자에게 문의바랍니다.");
    }

}


