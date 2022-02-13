package com.steam.library.global.common;

public enum Direction {
    UP(0),
    RIGHT(1),
    DOWN(2),
    LEFT(3);

    private final int value;
    Direction(int value) { this.value = value; }
    public int getValue() { return value; }
}
