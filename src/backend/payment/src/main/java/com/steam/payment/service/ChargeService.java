package com.steam.payment.service;

import com.steam.payment.dto.ChargeApproveRequest;
import com.steam.payment.dto.ChargeReadyRequest;
import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.dto.kakaopay.KakaoPayApproveResponse;
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
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ChargeService {
    private final GiftcardRepository giftcardRepository;
    private final UserRepository userRepository;
    private final ChargeLogDocumentRepository chargeLogDocumentRepository;
    private final KakaoPay kakaoPay;

    public List<GiftcardDto> getGiftcardList(String nation) {
        return giftcardRepository.findAllByCountry(nation)
                .stream()
                .map(GiftcardDto::of)
                .collect(Collectors.toList());
    }

    public Object chargeReady(ChargeReadyRequest request) {
        ChargeLogDocument chargeLogDocument = chargeLogDocumentRepository.findById(UserContext.getUserId().toString())
                .orElse(ChargeLogDocument.newUser(UserContext.getUserId()));
        chargeLogDocument.getChargeLogs().add(request.toLog());
        chargeLogDocument.plusCount();
        chargeLogDocumentRepository.save(chargeLogDocument);

        return kakaoPay.ready(request.getGiftcard());
    }

    public Object chargeApprove(ChargeApproveRequest request) {
        User user = userRepository.findById(UserContext.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        ChargeLogDocument chargeLogDoc = chargeLogDocumentRepository.findById(user.getIdx().toString())
                .orElseThrow(() -> new CustomException(ErrorCode.LOGGING_FAILED));
        ChargeLog chargeDoc = chargeLogDoc.getLastChargeLog();

        KakaoPayApproveResponse response = kakaoPay.approve(request.getTid(), request.getPgToken());

        chargeDoc.successApproval(user.getMoney());
        chargeLogDocumentRepository.save(chargeLogDoc);

        try {
            addUserMoney(user, response.getAmount().getTotal());
            chargeDoc.successAll(user.getMoney());
            chargeLogDocumentRepository.save(chargeLogDoc);
        } catch (RuntimeException e) {
            kakaoPay.cancel(request.getTid());
            chargeDoc.cancel();
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
