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
    private List<String> gameList = new ArrayList<>();
    private List<String> userList = new ArrayList<>();
    private Map<String, UserDto> users;
    private MapDto map;

    public RoomHash toHash() {
        return RoomHash.builder()
                .roomId(this.roomId.toString())
                .gameList(this.gameList)
                .userList(this.userList)
                .users(this.users)
                .map(this.map)
                .build();
    }

    public static Room of(RoomHash roomHash) {
        return Room.builder()
                .roomId(Integer.parseInt(roomHash.getRoomId()))
                .gameList(roomHash.getGameList())
                .userList(roomHash.getGameList())
                .users(roomHash.getUsers())
                .map(roomHash.getMap())
                .build();
    }

    public Integer leave(String userId) {
        this.getUserList().remove(userId);
        this.getUsers().remove(userId);
        return this.getUserList().size();
    }
}
