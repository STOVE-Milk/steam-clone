package com.steam.library.global.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

/*
    기본 메세지 형식은
    Behavior code + Json Message 입니다.
    ex)
        유저 방 1 입장
        10{"roomId":"1", authorization: "access_token"}
    참고 사이트 : Gather Town
    분석 과정 : https://github.com/STOVE-Milk/steam-clone/issues/24
*/
public enum Behavior {
    // 유저 입장
    ENTER(10),
    // 데이터 동기화
    SYNC(11),
    // 유저 위치 리셋
    RESET(12),
    // 유저 퇴장
    LEAVE(19),
    // 유저 이동
    MOVE(20),
    // 맵 업데이트 (오브젝트 건설)
    BUILD(40),
    // 에러
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
