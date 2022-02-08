package com.steam.library.entity;

import com.steam.library.dto.MapDto;
import com.steam.library.dto.UserDto;
import com.steam.library.global.util.JsonUtil;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Builder
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PACKAGE)
@AllArgsConstructor(access = AccessLevel.PACKAGE)
@RedisHash(value = "library", timeToLive = 900)
public class RoomCache {
    @Id
    private String roomId;
    private List<String> userList = new ArrayList<>();
    private Map<String, UserDto> users = new HashMap<>();
    private String map;

    public void addUser(String userId, UserDto user) {
        userList.add(userId);
        users.put(userId, user);
    }

    public void removeUser(String userId) {
        userList.remove(userId);
        users.remove(userId);
    }

    public void updateMap(MapDto map) {
        this.map = JsonUtil.toJson(map);
    }

    public void updateMap(String map) {
        this.map = map;
    }

    public void resetUserLocation() {
        this.users.forEach((key, user) -> {
            user.resetLocation();
        });
    }
}
