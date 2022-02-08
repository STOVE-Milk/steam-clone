package com.steam.library.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.library.entity.RoomCache;
import com.steam.library.global.common.Direction;
import com.steam.library.global.common.UserDetails;
import com.steam.library.global.util.JsonUtil;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.socket.WebSocketSession;

import java.util.*;

@Builder
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class Room {
    private Integer roomId;
    @JsonIgnore
    private List<WebSocketSession> sessions;
    private List<String> userList;
    private Map<String, UserDto> users;
    private MapDto map;

    public RoomCache toHash() {
        return RoomCache.builder()
                .roomId(this.roomId.toString())
                .userList(this.userList)
                .users(this.users)
                .map(JsonUtil.toJson(this.map))
                .build();
    }

    public static Room of(RoomCache roomCache) {
        Room room = Room.builder()
                .roomId(Integer.parseInt(roomCache.getRoomId()))
                .sessions(Collections.synchronizedList(new ArrayList<>()))
                .userList(roomCache.getUserList())
                .users(roomCache.getUsers())
                .map(JsonUtil.toMapDto(roomCache.getMap()))
                .build();
        room.getMap().initializeNullCollection();
        return room;
    }

    public static Room withMap(String roomId, MapDto map) {
        map.initializeNullCollection();
        return Room.builder()
                .roomId(Integer.parseInt(roomId))
                .sessions(Collections.synchronizedList(new ArrayList<>()))
                .userList(Collections.synchronizedList(new ArrayList<>()))
                .users(new HashMap<>())
                .map(map)
                .build();
    }

    public synchronized boolean enter(UserDetails userDetails, WebSocketSession session) {
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
    public synchronized Integer leave(String userId, WebSocketSession session) {
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

    public void resetUserLocation() {
        users.forEach((key, user) -> {
            user.resetLocation();
        });
    }

    public void updateMap(MapDto map) {
        this.map = map;
    }
}
