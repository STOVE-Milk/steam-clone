package com.steam.library.dto;

import com.steam.library.dto.MapDto;
import com.steam.library.dto.UserDto;
import com.steam.library.entity.RoomHash;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Builder
@Data
public class Room {
    private Integer roomId;
    private List<Integer> gameList = new ArrayList<>();
    private List<Integer> userList = new ArrayList<>();
    private Map<String, UserDto> users;
    private MapDto map;

    public RoomHash toEntity() {
        return RoomHash.builder()
                .roomId(this.roomId.toString())
                .gameList(this.gameList)
                .userList(this.userList)
                .users(this.users)
                .map(this.map)
                .build();
    }

//    public static Room newRoom(Integer roomId, UserDto user, MapDto map) {
//        return Room.builder()
//                .roomId()
//                .build();
//    }
}
