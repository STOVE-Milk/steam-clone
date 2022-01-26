package com.steam.library.global.common.message;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class InitMessage {
    private String roomId;
    private String token;
}
