package com.steam.library.global.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

public enum Behavior {
    ENTER(10),
    MOVE(20);

    private final int value;
    Behavior(int value) { this.value = value; }
    public int getValue() { return value; }

    public static Behavior fromInteger(Integer value) {
        System.out.println(value);
        switch(value) {
            case 10:
                return ENTER;
            case 20:
                return MOVE;
        }
        return null;
    }
}
