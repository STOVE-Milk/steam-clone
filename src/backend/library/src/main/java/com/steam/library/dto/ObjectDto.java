package com.steam.library.dto;

import lombok.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ObjectDto {
    private String name;
    private Integer x;
    private Integer y;
}
