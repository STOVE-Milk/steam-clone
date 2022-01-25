package com.steam.library.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Message<T> {
    /*
        TYPE: DATA
        ENTER: roomId, userDto --> 세션 연결과 동시에 처리해야해서 필요 없을수도 있다.
        MOVE: roomId
        LEAVE: roomId

        extends
        BUILD: roomId, objectType, objectDto(game or other)
        DEMOLISH: roomId, objectType, objectId

        BUILD_MODE: roomId
        BUILD_COMPLETE: roomId, gameObjectList, objectList
        BUILD_CANCEL: roomId

        SYNC: roomId
    */
    private String type;
    private T data;
}
