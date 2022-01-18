package com.steam.payment.service;

import com.steam.payment.dto.ChargeApproveRequest;
import com.steam.payment.dto.ChargeReadyRequest;
import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.dto.kakaopay.KakaoPayApproveResponse;
import com.steam.payment.entity.User;
import com.steam.payment.entity.mongodb.ChargeDoc;
import com.steam.payment.entity.mongodb.ChargeLogDoc;
import com.steam.payment.entity.redis.KakaoPayReadyCache;
import com.steam.payment.global.common.EmptyData;
import com.steam.payment.global.common.UserContext;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;
import com.steam.payment.repository.GiftcardRepository;
import com.steam.payment.repository.UserRepository;
import com.steam.payment.repository.mongodb.ChargeLogDocRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ChargeService {
    private final GiftcardRepository giftcardRepository;
    private final UserRepository userRepository;
    private final ChargeLogDocRepository chargeLogDocRepository;
    private final KakaoPay kakaoPay;

    public List<GiftcardDto> getGiftcardList(String nation) {
        return giftcardRepository.findAllByCountry(nation)
                .stream()
                .map(GiftcardDto::of)
                .collect(Collectors.toList());
    }

    public Object chargeReady(ChargeReadyRequest request) {
        ChargeLogDoc chargeLogDoc = chargeLogDocRepository.findById(UserContext.getUserId().toString())
                .orElse(ChargeLogDoc.newUser(UserContext.getUserId()));
        chargeLogDoc.getChargeDocs().add(request.toDocument());
        chargeLogDoc.plusCount();
        chargeLogDocRepository.save(chargeLogDoc);

        return kakaoPay.ready(request.getGiftcard());
    }

    public Object chargeApprove(ChargeApproveRequest request) {
        User user = userRepository.findById(UserContext.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        ChargeLogDoc chargeLogDoc = chargeLogDocRepository.findById(user.getIdx().toString())
                .orElseThrow(() -> new CustomException(ErrorCode.LOGGING_FAILED));
        ChargeDoc chargeDoc = chargeLogDoc.getLastChargeDoc();

        KakaoPayApproveResponse response = kakaoPay.approve(request.getTid(), request.getPgToken());

        chargeDoc.successApproval(user.getMoney());
        chargeLogDocRepository.save(chargeLogDoc);

        try {
            addUserMoney(user, response.getAmount().getTotal());
            chargeDoc.successAll(user.getMoney());
            chargeLogDocRepository.save(chargeLogDoc);
        } catch (RuntimeException e) {
            kakaoPay.cancel(request.getTid());
            chargeDoc.cancel();
            chargeLogDocRepository.save(chargeLogDoc);
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
