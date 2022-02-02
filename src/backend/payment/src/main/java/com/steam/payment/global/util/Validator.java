package com.steam.payment.global.util;

import com.steam.payment.dto.GameDto;
import com.steam.payment.entity.Game;
import com.steam.payment.entity.User;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;

import java.util.*;
import java.util.stream.Collectors;

public class Validator {
    //List<GameDto>
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

    public static Double validUserMoney(User user, Double totalPrice) {
        System.out.println("게임 총 가격 : " + totalPrice);
        System.out.println("유저 잔액 : " + user.getMoney());
        if(user.getMoney() < totalPrice)
            throw new CustomException(ErrorCode.GAME_PRICE_ACCUMULATE_FAILED);
        return totalPrice;
    }
}

