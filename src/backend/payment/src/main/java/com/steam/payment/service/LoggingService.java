package com.steam.payment.service;

import com.steam.payment.dto.ChargeReadyRequest;
import com.steam.payment.dto.GameDto;
import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.entity.User;
import com.steam.payment.entity.mongodb.ChargeLog;
import com.steam.payment.entity.mongodb.ChargeLogDocument;
import com.steam.payment.entity.mongodb.PurchaseLog;
import com.steam.payment.entity.mongodb.PurchaseLogDocument;
import com.steam.payment.global.common.UserContext;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;
import com.steam.payment.repository.mongodb.ChargeLogDocumentRepository;
import com.steam.payment.repository.mongodb.PurchaseLogDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class LoggingService {
    private final ChargeLogDocumentRepository chargeLogDocumentRepository;
    private final PurchaseLogDocumentRepository purchaseLogDocumentRepository;

    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void logPurchaseReadyStateAndRequestData(final User user, List<GameDto> gameDatas, Double totalPrice) {
        PurchaseLogDocument purchaseLogDocument = purchaseLogDocumentRepository.findById(UserContext.getUserId().toString())
                .orElseGet(() -> PurchaseLogDocument.newUser(user.getIdx()));
        purchaseLogDocument.addLog(PurchaseLog.of(user.getMoney(), gameDatas, totalPrice));
        purchaseLogDocumentRepository.save(purchaseLogDocument);
    }

    public void logPurchaseSuccessStateAndUpdateMoneyChange(Integer userId, Double totalPrice) {
        PurchaseLogDocument purchaseLogDocument = purchaseLogDocumentRepository.findById(UserContext.getUserId().toString())
                .orElseGet(() -> PurchaseLogDocument.newUser(userId));
        purchaseLogDocument.getLastPurchaseLog().subtractAfterMoney(totalPrice);
        purchaseLogDocument.getLastPurchaseLog().success();
        purchaseLogDocumentRepository.save(purchaseLogDocument);
    }

    public Integer logChargeReadyStateAndRequestData(ChargeReadyRequest request, GiftcardDto giftcardDto) {
        ChargeLogDocument chargeLogDocument = chargeLogDocumentRepository.findById(UserContext.getUserId().toString())
                .orElseGet(() -> ChargeLogDocument.newUser(UserContext.getUserId()));
        chargeLogDocument.addLog(request.toLog(giftcardDto));
        chargeLogDocumentRepository.save(chargeLogDocument);
        return chargeLogDocument.getCount();
    }

    public void logChargeApproveStateAndUpdateMoneyChange(User user) {
        ChargeLogDocument chargeLogDoc = chargeLogDocumentRepository.findById(UserContext.getUserId().toString())
                .orElseThrow(() -> new CustomException(ErrorCode.LOGGING_FAILED));
        // 충전 관련 로그 중 마지막 로그를 가져와 성공 여부에 따라 갱신하는 식으로 구현했습니다.
        ChargeLog chargeLog = chargeLogDoc.getLastChargeLog();
        chargeLog.initializeMoney(user.getMoney());
        chargeLog.successApproval();
        chargeLogDocumentRepository.save(chargeLogDoc);
    }

    public void logChargeSuccessStateAndUpdateMoneyChange(User user) {
        ChargeLogDocument chargeLogDoc = chargeLogDocumentRepository.findById(UserContext.getUserId().toString())
                .orElseThrow(() -> new CustomException(ErrorCode.LOGGING_FAILED));
        // 충전 관련 로그 중 마지막 로그를 가져와 성공 여부에 따라 갱신하는 식으로 구현했습니다.
        ChargeLog chargeLog = chargeLogDoc.getLastChargeLog();
        chargeLog.setAfterMoney(user.getMoney());
        chargeLog.successAll();
        chargeLogDocumentRepository.save(chargeLogDoc);
    }

    public void logChargeCancelState() {
        ChargeLogDocument chargeLogDoc = chargeLogDocumentRepository.findById(UserContext.getUserId().toString())
                .orElseThrow(() -> new CustomException(ErrorCode.LOGGING_FAILED));
        // 충전 관련 로그 중 마지막 로그를 가져와 성공 여부에 따라 갱신하는 식으로 구현했습니다.
        ChargeLog chargeLog = chargeLogDoc.getLastChargeLog();
        chargeLog.cancel();
        chargeLogDocumentRepository.save(chargeLogDoc);
    }
}
