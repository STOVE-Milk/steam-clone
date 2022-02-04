package com.steam.library.entity;

import com.steam.library.dto.MapDto;
import com.steam.library.dto.UserDto;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.ArrayList;
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
    private Map<String, UserDto> users;
    private MapDto map;
}
