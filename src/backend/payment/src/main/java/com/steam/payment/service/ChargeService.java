package com.steam.payment.service;

import com.steam.payment.dto.ChargeApproveRequest;
import com.steam.payment.dto.ChargeReadyRequest;
import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.dto.kakaopay.KakaoPayApproveResponse;
import com.steam.payment.entity.User;
import com.steam.payment.entity.redis.KakaoPayReadyCache;
import com.steam.payment.global.common.EmptyData;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;
import com.steam.payment.repository.GiftcardRepository;
import com.steam.payment.repository.UserRepository;
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
    private final KakaoPay kakaoPay;

    public List<GiftcardDto> getGiftcardList(String nation) {
        return giftcardRepository.findAllByCountry(nation)
                .stream()
                .map(GiftcardDto::of)
                .collect(Collectors.toList());
    }

    public Object chargeReady(ChargeReadyRequest request) {
        GiftcardDto giftcard = request.getGiftcard();
        return kakaoPay.ready(request.getGiftcard());
    }

    public Object chargeApprove(ChargeApproveRequest request) {
        KakaoPayApproveResponse response = kakaoPay.approve(request.getTid(), request.getPgToken());
        try {
            addUserMoney(1, response.getAmount().getTotal());
            throw new RuntimeException();
        } catch (RuntimeException e) {
            return kakaoPay.cancel(response.getAid());
            //throw new CustomException(ErrorCode.USER_CHARGE_CANCELD);
        }

        //return new EmptyData();
    }

    @Transactional
    protected void addUserMoney(Integer userId, Integer money) {
        User user = userRepository.findUserByIdx(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        user.chargeMoney(money);
        userRepository.save(user);
    }
}
