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

    public KakaoPayReadyResponse ready(GiftcardDto giftcard, Integer orderCount) {
        //TODO: LOGGING ORDER AND PUSH DATA INTO KakaoPayReady
        KakaoPayReady kakaoPayReady = KakaoPayReady.of(UserContext.getUserId(), giftcard, orderCount);
        kakaoPayReady.setCid(this.cid);
        kakaoPayReady.setApprovalUrl(this.approvalUrl);
        kakaoPayReady.setCancelUrl(this.cancelUrl);
        kakaoPayReady.setFailUrl(this.failUrl);

        KakaoPayReadyResponse kakaoPayReadyResponse = callKakaopayAPI(
                "ready",
                kakaoPayReady,
                KakaoPayReadyResponse.class,
                ErrorCode.KAKAOPAY_READY_FAILED
        );

        KakaoPayReadyCache cache = kakaoPayReady.toHashWithTid(kakaoPayReadyResponse.getTid());
        kakaoPayReadyCacheRepository.save(cache);

        return kakaoPayReadyResponse;

    }

    public KakaoPayApproveResponse approve(String tid, String pgToken) {
        KakaoPayReadyCache cache = kakaoPayReadyCacheRepository.findById(tid)
                .orElseThrow(() -> new CustomException(ErrorCode.KAKAOPAY_CACHE_DATA_NOT_FOUND));
        KakaoPayApprove kakaoPayApprove = KakaoPayApprove.of(cache, pgToken);

        return callKakaopayAPI(
                "approve",
                kakaoPayApprove,
                KakaoPayApproveResponse.class,
                ErrorCode.KAKAOPAY_APPROVAL_FAILED
        );
    }

    public void cancel(String tid) {
        KakaoPayReadyCache cache = kakaoPayReadyCacheRepository.findById(tid)
                .orElseThrow(() -> new CustomException(ErrorCode.KAKAOPAY_CACHE_DATA_NOT_FOUND));
        KakaoPayCancel kakaoPayCancel = KakaoPayCancel.of(cache);

        callKakaopayAPI(
                "cancel",
                kakaoPayCancel,
                KakaoPayCancelResponse.class,
                ErrorCode.KAKAOPAY_CANCEL_NOT_FOUND
        );
    }

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
