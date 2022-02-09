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
import java.util.concurrent.ConcurrentHashMap;

@Builder
@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class Room {
    private Integer roomId;
    private Integer userCount;
    @JsonIgnore
    private List<WebSocketSession> sessions;
    private Map<String, UserDto> users = new ConcurrentHashMap<>();
    private MapDto map;

    public RoomCache toHash() {
        return RoomCache.builder()
                .roomId(this.roomId.toString())
                .userCount(0)
                .users(this.users)
                .map(JsonUtil.toJson(this.map))
                .build();
    }

    public static Room of(RoomCache roomCache) {
        Room room = Room.builder()
                .roomId(Integer.parseInt(roomCache.getRoomId()))
                .sessions(Collections.synchronizedList(new ArrayList<>()))
                .userCount(roomCache.getUserCount())
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
                .userCount(0)
                .users(new HashMap<>())
                .map(map)
                .build();
    }

    public synchronized boolean enter(UserDetails userDetails, WebSocketSession session) {
        String userId = userDetails.getIdx().toString();
        try {
            if (!this.users.containsKey(userId)) {
                this.users.put(userId, UserDto.of(userDetails));
                this.userCount++;
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
            this.userCount--;
            this.getUsers().remove(userId);
            this.sessions.remove(session);
        } catch (RuntimeException e) {
            e.printStackTrace();
        }
        return this.userCount;
    }

    public void moveUser(String userId, Direction direction) {
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
