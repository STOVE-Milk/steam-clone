package com.steam.library.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;


@Builder
@Data
public class MapDto {
    private Integer side;
    private Map<String, GameObjectDto> games;
    private Map<String, OtherObjectDto> objects;
}
