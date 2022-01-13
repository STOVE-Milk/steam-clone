package com.steam.payment.global.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.DefaultResponseErrorHandler;

import java.io.IOException;

public class RestTemplateErrorHandler extends DefaultResponseErrorHandler {
    @Override
    protected boolean hasError(HttpStatus statusCode) {
        return super.hasError(statusCode);
    }

    @Override
    protected void handleError(ClientHttpResponse response, HttpStatus statusCode) throws IOException {
        //에러 그냥 넘겨주도록 처리
    }
}
