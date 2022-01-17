package com.steam.payment.dto;

import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PurchaseGamesRequest {
    List<GameDto> games = new ArrayList<>();

    public List<Integer> getGameIds() {
        return games.stream()
                .map(GameDto::getIdx)
                .collect(Collectors.toList());
    }
}
