package com.steam.library.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@ToString
@Builder
@Data
public class MapDto {
    private Integer side;
    private List<String> gameList;
    private List<String> objectList;
    private Map<String, ObjectDto> games;
    private Map<String, ObjectDto> objects;

    public static MapDto newMap() {
        return MapDto.builder()
                .side(5)
                .gameList(new ArrayList<>())
                .objectList(new ArrayList<>())
                .games(new HashMap<>())
                .objects(new HashMap<>())
                .build();
    }

    public void initializeNullCollection() {
        if(this.gameList == null)
            this.gameList = new ArrayList<>();
        if(this.objectList == null)
            this.objectList = new ArrayList<>();
        if(this.games == null)
            this.games = new HashMap<>();
        if(this.objects == null)
            this.objects = new HashMap<>();
    }
    public void pushGameObject(String id, ObjectDto game) {
        this.games.put(id, game);
    }
    public void pushObject(String id, ObjectDto object) {
        this.objects.put(id, object);
    }
}
