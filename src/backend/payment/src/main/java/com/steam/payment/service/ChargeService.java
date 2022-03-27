package com.steam.payment.service;

import com.steam.payment.dto.ChargeApproveRequest;
import com.steam.payment.dto.ChargeReadyRequest;
import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.dto.kakaopay.KakaoPayApproveResponse;
import com.steam.payment.dto.kakaopay.KakaoPayReadyResponse;
import com.steam.payment.entity.Balance;
import com.steam.payment.entity.Giftcard;
import com.steam.payment.entity.User;
import com.steam.payment.entity.mongodb.ChargeLog;
import com.steam.payment.entity.mongodb.ChargeLogDocument;
import com.steam.payment.global.common.EmptyData;
import com.steam.payment.global.common.UserContext;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;
import com.steam.payment.repository.GiftcardRepository;
import com.steam.payment.repository.UserRepository;
import com.steam.payment.repository.mongodb.ChargeLogDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChargeService {
    private final GiftcardRepository giftcardRepository;
    private final UserRepository userRepository;
    private final LoggingService loggingService;
    private final KakaoPay kakaoPay;

    public Balance getBalance() {
        return userRepository.findBalanceByUserId(UserContext.getUserId());
    }

    public List<GiftcardDto> getGiftcardList(String nation) {
        return giftcardRepository.findTop4ByCountry(nation)
                .stream()
                .map(GiftcardDto::of)
                .collect(Collectors.toList());
    }

    /*
        ChargeLog는 충전 관련 로그이고, MongoDB를 사용해 로깅을 합니다.
            Entity와 구분하기위해 Document라는 이름을 붙였습니다.
        충전은 카카오페이 API를 이용해 우리가 정한 상품권을 구매하는 식으로 구현했습니다.

        충전 세부 단계
            충전 준비 API
                로깅
                카카오페이 결제 준비 API 요청
                    결제 관련 데이터 Redis 캐싱
            Response로 QR코드 전송
                유저가 브라우저에 띄어진 QR코드를 이용해 카카오페이로 상품권 결제
                    결제 성공 | 실패 | 취소
            결제 성공 시 결제 승인 API
                로깅
                카카오페이 결제 승인 API 요청
                로깅
                실제 DB의 유저 충전 트랜잭션
                로깅
            트랜잭션 실패 시 카카오페이 결제 취소 API 요청 후 로깅
    */

    public KakaoPayReadyResponse chargeReady(ChargeReadyRequest request) {
        final Giftcard giftcard = giftcardRepository.findById(request.getGiftcard().getId())
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
        GiftcardDto giftcardDto = GiftcardDto.of(giftcard);

        Integer logCount = loggingService.logChargeReadyStateAndRequestData(request, giftcardDto);

        return kakaoPay.callReadyAPI(giftcardDto, logCount);
    }

    public EmptyData chargeApprove(ChargeApproveRequest request) {
        try {
            User user = userRepository.findById(UserContext.getUserId())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

            KakaoPayApproveResponse response = kakaoPay.callApproveAPI(request.getTid(), request.getPgToken());
            loggingService.logChargeApproveStateAndUpdateMoneyChange(user);

            user.addMoney(Double.valueOf(response.getAmount().getTotal()));
            userRepository.save(user);

            loggingService.logChargeSuccessStateAndUpdateMoneyChange(user);
        } catch (RuntimeException e) {
            kakaoPay.callCancelAPI(request.getTid());
            loggingService.logChargeCancelState();
            throw new CustomException(ErrorCode.USER_CHARGE_CANCLED);
        }
        return new EmptyData();
    }
}
