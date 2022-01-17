package com.steam.payment.global.util;

import com.steam.payment.dto.GameDto;
import com.steam.payment.entity.Game;
import com.steam.payment.entity.User;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

public class Validator {
    //List<GameDto>
    public static boolean validGamePrice(final List<GameDto> gameEntityData, final List<GameDto> gameRequestData) {
        List<GameDto> sortedGames = gameRequestData.stream()
                .sorted(Comparator.comparingInt(GameDto::getIdx))
                .collect(Collectors.toList());

        for(int i = 0; i < gameEntityData.size(); i++) {
            GameDto game1 = gameEntityData.get(i);
            GameDto game2 = gameRequestData.get(i);

            if(!Objects.equals(game1, game2))
                throw new CustomException(ErrorCode.GAME_PRICE_VALIDATION_FAILED);
        }

        return true;
    }

    public static Double validUserMoney(User user, Double totalPrice) {
        System.out.println("게임 총 가격 : " + totalPrice);
        System.out.println("유저 잔액 : " + user.getMoney());
        if(user.getMoney() < totalPrice)
            throw new CustomException(ErrorCode.GAME_PRICE_VALIDATION_FAILED);
        return totalPrice;
    }
}

