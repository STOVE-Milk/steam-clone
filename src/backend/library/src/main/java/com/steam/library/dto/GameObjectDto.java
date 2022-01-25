package com.steam.library.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Builder
@Data
public class GameObjectDto {
    private String name;
    private Integer x;
    private Integer y;
}
