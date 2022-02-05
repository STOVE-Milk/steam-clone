package com.steam.library.service;

import com.steam.library.dto.MapDto;
import com.steam.library.dto.Room;
import com.steam.library.entity.RoomCache;
import com.steam.library.entity.User;
import com.steam.library.global.util.JsonUtil;
import com.steam.library.repository.RoomCacheRepository;
import com.steam.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RequiredArgsConstructor
@Slf4j
@Service
public class SocketDataService {
    private final UserRepository userRepository;
    private final RoomCacheRepository roomCacheRepository;

    @Nullable
    public MapDto getUserMap(Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty()) {
            log.info("유저 없음");
            return null;
        }

        String mapJson = user.get().getMap();
        if(mapJson == null || "".equals(mapJson) || "{}".equals(mapJson)) {
            log.info("map 데이터 없음");
            MapDto newMap = MapDto.newMap();
            user.get().updateMap(JsonUtil.toJson(newMap));
            userRepository.save(user.get());
            return newMap;
        }

        return JsonUtil.toMapDto(mapJson);
    }

    public Room getRoomHash(String roomId, Integer userId) {
        Optional<RoomCache> roomCache = roomCacheRepository.findById(roomId);
        if(roomCache.isPresent()) {
            return Room.of(roomCache.get());
        } else {
            MapDto mapDto = getUserMap(userId);
            return Room.withMap(roomId, mapDto);
        }
    }

    public boolean updateUserMap(Integer userId, MapDto map) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty())
            return false;

        String mapJson = JsonUtil.toJson(map);
        if(mapJson == null)
            return false;

        user.get().updateMap(mapJson);
        userRepository.save(user.get());

        return true;
    }

    public boolean saveRoomHash(Room room) {
        try {
            RoomCache roomCache = room.toHash();
            roomCacheRepository.save(roomCache);
            return true;
        } catch (RuntimeException e) {
            log.debug("Room data 캐싱 실패 " + e.getMessage());
            return false;
        }
    }
}
