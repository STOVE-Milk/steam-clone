package com.steam.library.global.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

public enum Behavior {
    ENTER(10),
    SYNC(11),
    RESET(12),
    LEAVE(19),
    MOVE(20),
    BUILD(40),
    ERROR(99)
    ;

    private final int value;
    Behavior(int value) { this.value = value; }
    public int getValue() { return value; }

    public static Behavior fromInteger(Integer value) {
        switch(value) {
            case 10:
                return ENTER;
            case 11:
                return SYNC;
            case 12:
                return RESET;
            case 19:
                return LEAVE;
            case 20:
                return MOVE;
            case 40:
                return BUILD;
            case 99:
                return ERROR;
        }
        return null;
    }
}
