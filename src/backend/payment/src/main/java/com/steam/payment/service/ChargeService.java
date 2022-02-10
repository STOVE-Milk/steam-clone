package com.steam.payment.service;

import com.steam.payment.dto.ChargeApproveRequest;
import com.steam.payment.dto.ChargeReadyRequest;
import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.dto.kakaopay.KakaoPayApproveResponse;
import com.steam.payment.entity.Balance;
import com.steam.payment.entity.Giftcard;
import com.steam.payment.entity.User;
import com.steam.payment.entity.mongodb.ChargeLog;
import com.steam.payment.entity.mongodb.ChargeLogDocument;
import com.steam.payment.global.common.Body;
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
    private final ChargeLogDocumentRepository chargeLogDocumentRepository;
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

    public Object chargeReady(ChargeReadyRequest request) {
        final Giftcard giftcard = giftcardRepository.findById(request.getGiftcard().getId())
                .orElseThrow(() -> new CustomException(ErrorCode.DATA_NOT_FOUND));
        GiftcardDto giftcardDto = GiftcardDto.of(giftcard);

        ChargeLogDocument chargeLogDocument = chargeLogDocumentRepository.findById(UserContext.getUserId().toString())
                .orElseGet(() -> ChargeLogDocument.newUser(UserContext.getUserId()));
        chargeLogDocument.addLog(request.toLog(giftcardDto));
        chargeLogDocumentRepository.save(chargeLogDocument);

        return kakaoPay.ready(giftcardDto, chargeLogDocument.getCount());
    }

    public Object chargeApprove(ChargeApproveRequest request) {
        User user = userRepository.findById(UserContext.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        ChargeLogDocument chargeLogDoc = chargeLogDocumentRepository.findById(user.getIdx().toString())
                .orElseThrow(() -> new CustomException(ErrorCode.LOGGING_FAILED));
        ChargeLog chargeLog = chargeLogDoc.getLastChargeLog();

        KakaoPayApproveResponse response = kakaoPay.approve(request.getTid(), request.getPgToken());

        chargeLog.successApproval(user.getMoney());
        chargeLogDocumentRepository.save(chargeLogDoc);

        try {
            addUserMoney(user, response.getAmount().getTotal());
            chargeLog.successAll(user.getMoney());
            chargeLogDocumentRepository.save(chargeLogDoc);
        } catch (RuntimeException e) {
            kakaoPay.cancel(request.getTid());
            chargeLog.cancel();
            chargeLogDocumentRepository.save(chargeLogDoc);
            throw new CustomException(ErrorCode.USER_CHARGE_CANCLED);
        }
        return new EmptyData();
    }

    @Transactional
    protected void addUserMoney(User user, Integer money) {
        user.addMoney(Double.valueOf(money));
        userRepository.save(user);
    }
}
