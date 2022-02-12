package com.steam.payment.service;

import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.dto.kakaopay.*;
import com.steam.payment.entity.redis.KakaoPayReadyCache;
import com.steam.payment.global.common.UserContext;
import com.steam.payment.global.error.ErrorCode;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.util.JsonUtil;
import com.steam.payment.repository.redis.KakaoPayReadyCacheRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
public class KakaoPay {
    @Value("${milk.kakaopay.api-url}")
    private String kakaopayUrl;
    @Value("${milk.kakaopay.cid}")
    private String cid;
    @Value("${milk.kakaopay.url.approval}")
    private String approvalUrl;
    @Value("${milk.kakaopay.url.cancel}")
    private String cancelUrl;
    @Value("${milk.kakaopay.url.fail}")
    private String failUrl;
    @Value("${milk.kakaopay.access-token}")
    private String accessToken;

    private final JsonUtil jsonUtil;

    private final RestTemplate restTemplate;
    private final KakaoPayReadyCacheRepository kakaoPayReadyCacheRepository;

    /*
        카카오페이 API를 실제적으로 호출하는 서비스입니다.
        Request 객체를 만들어 API Call 메소드에 넘겨주어 처리합니다. --> 93번줄
    */
    public KakaoPayReadyResponse ready(GiftcardDto giftcard, Integer orderCount) {
        KakaoPayReadyRequest kakaoPayReadyRequest = KakaoPayReadyRequest.of(UserContext.getUserId(), giftcard, orderCount);
        kakaoPayReadyRequest.setCid(this.cid);
        kakaoPayReadyRequest.setApprovalUrl(this.approvalUrl);
        kakaoPayReadyRequest.setCancelUrl(this.cancelUrl);
        kakaoPayReadyRequest.setFailUrl(this.failUrl);

        KakaoPayReadyResponse kakaoPayReadyResponse = callKakaopayAPI(
                "ready",
                kakaoPayReadyRequest,
                KakaoPayReadyResponse.class,
                ErrorCode.KAKAOPAY_READY_FAILED
        );

        KakaoPayReadyCache cache = kakaoPayReadyRequest.toHashWithTid(kakaoPayReadyResponse.getTid());
        kakaoPayReadyCacheRepository.save(cache);

        return kakaoPayReadyResponse;

    }

    public KakaoPayApproveResponse approve(String tid, String pgToken) {
        KakaoPayReadyCache cache = kakaoPayReadyCacheRepository.findById(tid)
                .orElseThrow(() -> new CustomException(ErrorCode.KAKAOPAY_CACHE_DATA_NOT_FOUND));
        KakaoPayApproveRequest kakaoPayApproveRequest = KakaoPayApproveRequest.of(cache, pgToken);

        return callKakaopayAPI(
                "approve",
                kakaoPayApproveRequest,
                KakaoPayApproveResponse.class,
                ErrorCode.KAKAOPAY_APPROVAL_FAILED
        );
    }

    public void cancel(String tid) {
        KakaoPayReadyCache cache = kakaoPayReadyCacheRepository.findById(tid)
                .orElseThrow(() -> new CustomException(ErrorCode.KAKAOPAY_CACHE_DATA_NOT_FOUND));
        KakaoPayCancelRequest kakaoPayCancelRequest = KakaoPayCancelRequest.of(cache);

        callKakaopayAPI(
                "cancel",
                kakaoPayCancelRequest,
                KakaoPayCancelResponse.class,
                ErrorCode.KAKAOPAY_CANCEL_NOT_FOUND
        );
    }

    /*
        중복적으로 사용될 것 같은 카카오페이 API 콜을 하나의 메소드로 처리하기 위해 만들었습니다.
            카카오페이 API 요청을 위한 헤더 설정
            요청 데이터 Body 설정
            Response 데이터를 담을 클래스 지정
            발생할 수 있는 에러를 받아 처리
            RestTemplate를 이용한 동기적 API Call
    */
    private <T> T callKakaopayAPI(String apiType, Object data, Class<T> returnClass, ErrorCode error) {
        HttpHeaders headers = new KakaoPayHeader(accessToken);
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.setAll(jsonUtil.of(data));

        try {
            return restTemplate.exchange(
                    kakaopayUrl + apiType,
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    returnClass
            ).getBody();
        } catch (RestClientException e) {
            throw new CustomException(error);
        }
    }

    public KakaoPay(JsonUtil jsonUtil, RestTemplate restTemplate, KakaoPayReadyCacheRepository kakaoPayReadyCacheRepository) {
        this.jsonUtil = jsonUtil;
        this.restTemplate = restTemplate;
        this.kakaoPayReadyCacheRepository = kakaoPayReadyCacheRepository;
    }
}
