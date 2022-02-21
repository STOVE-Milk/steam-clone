package com.steam.payment.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
public class PurchaseGamesResponse {
    List<GameDto> games = new ArrayList<>();

    @JsonIgnore
    public List<Integer> getGameIds() {
        return games.stream()
                .map(GameDto::getId)
                .collect(Collectors.toList());
    }
}
