package com.steam.payment.service;

import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.dto.kakaopay.KakaoPayReadyResponse;
import com.steam.payment.global.error.ErrorCode;

public interface PaymentService {
    //Object callReadyAPI(Object requestDto, Integer orderCount);

    /*
        카카오페이 API를 실제적으로 호출하는 서비스입니다.
        Request 객체를 만들어 API Call 메소드에 넘겨주어 처리합니다. --> 93번줄
    */
    Object callReadyAPI(GiftcardDto giftcard, Integer orderCount);

    Object callApproveAPI(String tid, String pgToken);

    void callCancelAPI(String id);

    <T> T callExternalAPI(String apiType, Object data, Class<T> returnClass, ErrorCode error);
}
