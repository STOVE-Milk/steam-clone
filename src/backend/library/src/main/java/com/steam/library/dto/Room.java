package com.steam.library.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.library.dto.MapDto;
import com.steam.library.dto.UserDto;
import com.steam.library.entity.RoomHash;
import com.steam.library.global.common.Direction;
import com.steam.library.global.common.UserDetails;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Builder
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class Room {
    private Integer roomId;
    @JsonIgnore
    private List<WebSocketSession> sessions = new ArrayList<>();
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
                .sessions(new ArrayList<>())
                .gameList(roomHash.getGameList())
                .userList(roomHash.getUserList())
                .users(roomHash.getUsers())
                .map(roomHash.getMap())
                .build();
    }

    public boolean enter(UserDetails userDetails, WebSocketSession session) {
        String userId = userDetails.getIdx().toString();
        try {
            if (!this.users.containsKey(userId)) {
                this.userList.add(userId);
                this.users.put(userId, UserDto.of(userDetails));
            }
            this.sessions.add(session);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
    public Integer leave(String userId, WebSocketSession session) {
        try {
            this.getUserList().remove(userId);
            this.getUsers().remove(userId);
            this.sessions.remove(session);
        } catch (RuntimeException e) {
            e.printStackTrace();
        }
        return this.getUserList().size();
    }

    public void move(String userId, Direction direction) {
        this.getUsers().get(userId).move(direction, this.map.getSide());
    }
}
