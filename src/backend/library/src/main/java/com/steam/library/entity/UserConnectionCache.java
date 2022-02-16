package com.steam.library.entity;

import com.steam.library.dto.MapDto;
import com.steam.library.dto.UserConnection;
import com.steam.library.dto.UserDto;
import com.steam.library.global.common.Direction;
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
@RedisHash(value = "connections", timeToLive = -1)
public class UserConnectionCache {
    @Id
    private String userId;
    // roomId, sessionid
    private Map<String, String> connections = new HashMap<>();

    public static UserConnectionCache createEmptyCacheById(String userId) {
        return UserConnectionCache.builder()
                .userId(userId)
                .connections(new HashMap<>())
                .build();
    }
}
