package com.steam.library.service;

import com.steam.library.dto.MapDto;
import com.steam.library.dto.Room;
import com.steam.library.dto.UserDto;
import com.steam.library.entity.Library;
import com.steam.library.entity.RoomCache;
import com.steam.library.entity.User;
import com.steam.library.global.util.JsonUtil;
import com.steam.library.repository.LibraryRepository;
import com.steam.library.repository.RoomCacheRepository;
import com.steam.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class SocketDataService {
    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
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

    public Room makeRoom(String roomId) {
        return Room.withMap(roomId, getUserMap(Integer.parseInt(roomId)));
    }

    public boolean updateUserMap(Integer userId, MapDto map) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty())
            return false;

        // 일단 사이즈만 가지고 판단
        List<Integer> gameIds = map.getGameList().stream()
                        .map(Integer::parseInt)
                        .collect(Collectors.toList());
        if(gameIds.size() > 0) {
            List<Library> libraries = libraryRepository.findAllByUserIdAndGameIdIn(userId, gameIds);
            if (gameIds.size() == libraries.size()) {
                String mapJson = JsonUtil.toJson(map);
                if (mapJson == null)
                    return false;

                user.get().updateMap(mapJson);
                userRepository.save(user.get());
                return true;
            } else {
                return false;
            }
        } else {
            String mapJson = JsonUtil.toJson(map);
            if (mapJson == null)
                return false;

            user.get().updateMap(mapJson);
            userRepository.save(user.get());
            return true;
        }
    }

    public synchronized Room addUserToRedis(String roomId, String enteredUserId, UserDto enteredUser) {
        Optional<RoomCache> opRoomCache = roomCacheRepository.findById(roomId);
        RoomCache roomCache;
        if(opRoomCache.isPresent()) {
            roomCache = opRoomCache.get();
        } else {
            // UserMap 두번 select 하게됨
            roomCache = Room.withMap(roomId, getUserMap(Integer.parseInt(roomId))).toHash();
        }
        roomCache.addUser(enteredUserId, enteredUser);
        roomCacheRepository.save(roomCache);
        return Room.of(roomCache);
    }

    public synchronized void removeUserInRedis(String roomId, String leavedUserId) {
        Optional<RoomCache> opRoomCache = roomCacheRepository.findById(roomId);
        RoomCache roomCache;
        if(opRoomCache.isPresent()) {
            roomCache = opRoomCache.get();
            roomCache.removeUser(leavedUserId);
            roomCacheRepository.save(roomCache);
        }
    }

    public Room getRoomCache(String roomId) {
        try {
            return Room.of(roomCacheRepository.findById(roomId).get());
        } catch (RuntimeException e) {
            log.debug("Room data 캐싱 실패 " + e.getMessage());
            return null;
        }
    }

    public boolean saveRoomCache(Room room) {
        try {
            RoomCache roomCache = room.toHash();
            roomCacheRepository.save(roomCache);
            return true;
        } catch (RuntimeException e) {
            log.debug("Room data 캐싱 실패 " + e.getMessage());
            return false;
        }
    }

    public boolean resetUserLocationAndUpdateMap(String roomId, MapDto map) {
        try {
            RoomCache roomCache = roomCacheRepository.findById(roomId).get();
            roomCache.updateMap(map);
            roomCache.resetUserLocation();
            roomCacheRepository.save(roomCache);
            return true;
        } catch (RuntimeException e) {
            log.debug("Room data 캐싱 실패 " + e.getMessage());
            return false;
        }
    }
}
