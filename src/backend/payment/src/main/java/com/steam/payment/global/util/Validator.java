package com.steam.payment.global.util;

import com.steam.payment.dto.GameDto;
import com.steam.payment.entity.Game;
import com.steam.payment.entity.User;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;

import java.util.*;
import java.util.stream.Collectors;

public class Validator {
    /*
        게임 장바구니에서 구매를 실행할 때, 개발사 측에서 게임 가격이나 할인율을 변경했다면 정보가 일치하지 않을 수 있습니다.
        또한 사용자가 요청을 변조해서 보내면 게임 정보가 일치하지 않을 수 있습니다.
        그래서 실제 DB의 게임 가격 정보와 유저가 요청한 장바구니의 게임 가격 정보를 비교 검증합니다.

        장바구니의 게임 정보는 순서가 DB PK순으로 정렬되지 않기 때문에,
        정렬을 진행한 후 순차적으로 PK순으로 정렬된 DB 게임 가격 정보와 비교합니다.
    */
    public static boolean validGamePrice(final List<GameDto> gameEntityData, final List<GameDto> gameRequestData) {
        List<GameDto> sortedGames = new ArrayList<>();
        if(gameRequestData.size() > 1) {
            sortedGames = gameRequestData.stream()
                    .sorted(Comparator.comparingInt(GameDto::getId))
                    .collect(Collectors.toList());
        } else {
            sortedGames = gameRequestData;
        }

        for(int i = 0; i < gameEntityData.size(); i++) {
            GameDto game1 = gameEntityData.get(i);
            GameDto game2 = sortedGames.get(i);
            if(!GameDto.equals(game1, game2))
                throw new CustomException(ErrorCode.GAME_PRICE_VALIDATION_FAILED);
        }

        return true;
    }

    /*
        유저 잔액이 게임의 총 금액보다 큰지(구매할 수 있는지) 검증합니다.
    */
    public static Double validUserMoney(User user, Double totalPrice) {
        System.out.println("게임 총 가격 : " + totalPrice);
        System.out.println("유저 잔액 : " + user.getMoney());
        if(user.getMoney() < totalPrice)
            throw new CustomException(ErrorCode.USER_MONEY_NOT_ENOUGH);
        return totalPrice;
    }
}

