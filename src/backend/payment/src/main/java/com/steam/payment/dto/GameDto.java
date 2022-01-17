package com.steam.payment.dto;

import com.steam.payment.entity.Game;
import com.steam.payment.entity.Library;
import com.steam.payment.entity.User;
import com.steam.payment.global.util.JsonUtil;
import lombok.Builder;
import lombok.Getter;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

@Builder
@Getter
public class GameDto {
    private Integer idx;
    private Double price;
    private Integer sale;

    public Double getSalePrice() {
        return price - (price * sale / 100);
    }

    public static GameDto of(final Game game, String country) {
        return GameDto.builder()
                .idx(game.getIdx())
                .price(game.priceOf(country))
                .sale(game.getIdx())
                .build();
    }

    public Library toLibrary(final User user) {
        return Library.builder()
                .user(user)
                .gameId(this.idx)
                .isVisible(true)
                .playTime(0)
                .build();
    }
}
