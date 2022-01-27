package com.steam.library.dto;

import lombok.*;

import java.util.HashMap;
import java.util.Map;


@ToString
@Builder
@Data
public class MapDto {
    private Integer side;
    private Map<String, ObjectDto> games;
    private Map<String, ObjectDto> objects;

    public static MapDto newMap() {
        return MapDto.builder()
                .side(5)
                .games(new HashMap<>())
                .objects(new HashMap<>())
                .build();
    }

    public void pushGameObject(String id, ObjectDto game) {
        this.games.put(id, game);
    }
    public void pushObject(String id, ObjectDto object) {
        this.objects.put(id, object);
    }
}
