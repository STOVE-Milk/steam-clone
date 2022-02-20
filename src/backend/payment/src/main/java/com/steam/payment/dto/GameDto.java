package com.steam.payment.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private Integer id;
    @JsonIgnore
    private Integer publisherId;
    private String name;
    private Double price;
    private Integer sale;

    public static boolean equals(GameDto game1, GameDto game2) {
        return (game1.getId().equals(game2.getId())) &&
                (game1.getPrice().equals(game2.getPrice())) &&
                (game1.getSale().equals(game2.getSale()));
    }

    public Double getSalePrice() {
        return price - (price * sale / 100);
    }

    public static GameDto of(final Game game, String country) {
        return GameDto.builder()
                .id(game.getIdx())
                .publisherId(game.getPublisherId())
                .name(game.getName())
                .price(game.priceOf(country))
                .sale(game.getSale())
                .build();
    }

    public Library toLibraryEntity(final User user) {
        return Library.builder()
                .user(user)
                .gameId(this.id)
                .isVisible(true)
                .playTime(0)
                .build();
    }
}
