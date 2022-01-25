package com.steam.payment.dto;

import com.steam.payment.entity.User;
import com.steam.payment.entity.mongodb.PurchaseLog;
import lombok.Getter;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PurchaseGamesRequest {
    @NotNull
    List<GameDto> games = new ArrayList<>();

    public List<Integer> getGamesId() {
        return games.stream()
                .map(GameDto::getId)
                .collect(Collectors.toList());
    }
}
