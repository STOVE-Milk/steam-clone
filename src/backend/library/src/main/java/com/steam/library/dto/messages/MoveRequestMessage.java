package com.steam.library.dto.messages;

import com.steam.library.global.common.Direction;
import lombok.Data;

@Data
public class MoveRequestMessage {
    private Direction direction;
}
