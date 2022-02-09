package com.steam.library.service;

import com.steam.library.dto.MapDto;
import com.steam.library.dto.Room;
import com.steam.library.dto.UserDto;
import com.steam.library.entity.Library;
import com.steam.library.entity.RoomCache;
import com.steam.library.entity.User;
import com.steam.library.global.common.Direction;
import com.steam.library.global.common.UserDetails;
import com.steam.library.global.util.JsonUtil;
import com.steam.library.repository.LibraryRepository;
import com.steam.library.repository.RoomCacheRepository;
import com.steam.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class SocketDataService {
    private static final Integer MAX_SIDE_OF_MAP = 100000; //20;

    private static final Integer WAIT_TIME_OF_LOCK = 5;
    private static final Integer EXPIRE_TIME_OF_LOCK = 5;
    private static final String PREFIX_OF_LOCK = "lock_robby";
    private static final TimeUnit TIME_UNIT = TimeUnit.SECONDS;

    private final RedisTemplate<String, Object> redisTemplate;
    private final RedissonClient redissonClient;

    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
    private final RoomCacheRepository roomCacheRepository;

    //TODO: 전체 트랜잭션 처리 Transactional or TransactionManager --> Transaction과 Lock 동시 불가, 내부 로직인 경우 불가
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

    public Room addUserToRedis(String roomId, String enteredUserId, UserDetails enteredUser) {
        RoomCache roomCache;
        RLock roomLock = redissonClient.getLock(PREFIX_OF_LOCK + roomId);
        try {
            roomLock.lockInterruptibly(EXPIRE_TIME_OF_LOCK, TIME_UNIT);
//            Boolean isLocked = roomLock.tryLock(WAIT_TIME_OF_LOCK, EXPIRE_TIME_OF_LOCK, TIME_UNIT);
//            if(isLocked) {
//                 log.info("enter lock 획득 실패");
//                 return null;
//            }

            Optional<RoomCache> opRoomCache = roomCacheRepository.findById(roomId);
            if(opRoomCache.isPresent()) {
                roomCache = opRoomCache.get();
            } else {
                // UserMap 두번 select 하게됨
                roomCache = Room.withMap(roomId, getUserMap(Integer.parseInt(roomId))).toHash();
            }
            roomCache.addUser(enteredUserId, UserDto.of(enteredUser));
            roomCacheRepository.save(roomCache);
            return Room.of(roomCache);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            roomLock.unlock();
        }

        return null;
    }

    public synchronized void moveUserInRedis(String roomId, String movedUserId, Direction direction) {
        HashOperations<String, String, Integer> hash = redisTemplate.opsForHash();
        String mainKey = "library:" + roomId;
        String hashKey = "users.[" + movedUserId + "].";
        try {
            if (Boolean.TRUE.equals(hash.hasKey(mainKey, hashKey + 'x'))) {
                switch (direction) {
                    case UP:
                        hashKey += 'y';
                        if (hash.get(mainKey, hashKey) < MAX_SIDE_OF_MAP)
                            hash.increment(mainKey, hashKey, 1);
                        break;
                    case RIGHT:
                        hashKey += 'x';
                        if (hash.get(mainKey, hashKey) < MAX_SIDE_OF_MAP)
                            hash.increment(mainKey, hashKey, 1);
                        break;
                    case DOWN:
                        hashKey += 'y';
                        if (hash.get(mainKey, hashKey) > 0)
                            hash.increment(mainKey, hashKey, -1);
                        break;
                    case LEFT:
                        hashKey += 'x';
                        if (hash.get(mainKey, hashKey) > 0)
                            hash.increment(mainKey, hashKey, -1);
                        break;
                }
            }
        } catch (NullPointerException e) {
            log.info(mainKey + "." + hashKey);
            log.info(hash.get(mainKey, hashKey).toString());
        }
    }

    public void removeUserInRedis(String roomId, String leavedUserId) {
        HashOperations<String, String, Integer> hash = redisTemplate.opsForHash();
        String mainKey = "library:" + roomId;
        String hashKey = "users.[" + leavedUserId + "].";

        RLock roomLock = redissonClient.getLock(PREFIX_OF_LOCK + roomId);
        try {
            roomLock.lockInterruptibly(EXPIRE_TIME_OF_LOCK, TIME_UNIT);

            hash.increment(mainKey, "userCount", -1);
            hash.delete(mainKey, hashKey + 'x');
            hash.delete(mainKey, hashKey + 'y');
            hash.delete(mainKey, hashKey + "nickname");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            roomLock.unlock();
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
        RLock roomLock = redissonClient.getLock(PREFIX_OF_LOCK + roomId);
        try {
            roomLock.lockInterruptibly(EXPIRE_TIME_OF_LOCK, TIME_UNIT);
//            Boolean isLocked = roomLock.tryLock(WAIT_TIME_OF_LOCK, EXPIRE_TIME_OF_LOCK, TIME_UNIT);
//            if (isLocked) {
//                log.info("leave lock 획득 실패");
//                return false;
//            }
            RoomCache roomCache = roomCacheRepository.findById(roomId).get();
            roomCache.updateMap(map);
            roomCache.resetUserLocation();
            roomCacheRepository.save(roomCache);
            return true;
        } catch (RuntimeException e) {
            log.debug("Room data 캐싱 실패 " + e.getMessage());
            return false;
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            roomLock.unlock();
        }
        return true;
    }
}
