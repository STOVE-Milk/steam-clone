package com.steam.library.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ObjectDto {
    private String name;
    private Integer x;
    private Integer y;
}
