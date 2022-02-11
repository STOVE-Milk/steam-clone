package com.steam.library.dto.messages;

import com.steam.library.dto.Room;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SyncRoomMessage {
    Room room;

    public static SyncRoomMessage of(Room room) {
        return SyncRoomMessage.builder()
                .room(room)
                .build();
    }
}