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

    /*
        Redis에 여러 서버가 접근할 경우 동시성 문제
            스레드간의 동시성 처리는 가능했지만 여러 서버가 Redis에 접근할 경우에 문제가 발생했습니다.
            따로 Redis 접근에 대한 동시성 처리를 해주는 서버가 없었고 해당 로직 내애서 처리하기로 했습니다.
            Redisson을 이용해 분산 락 방식을 적용하여 Redisson 접근에 대한 동시성 처리를 진행했습니다.
                스핀 락과 대비해 pub/sub을 이용해 락이 풀리는 것을 알려줘 지속적인 락 확인이 필요 없어서 자원상에도 유리하다 하여 Redisson을 선택했습니다.

        아래는 락에 필요한 정보들 입니다.
    */
    private static final Integer WAIT_TIME_OF_LOCK = 5;
    private static final Integer EXPIRE_TIME_OF_LOCK = 5;
    private static final String PREFIX_OF_LOCK = "lock_robby";
    private static final TimeUnit TIME_UNIT = TimeUnit.SECONDS;

    /*
        Room에 대한 상태 정보를 Redis에 저장합니다.
        spring data redis를 이용해 객체로만 처리하던 중 불필요한 조회까지 진행하게 되었습니다.
        특정 로직의 경우 RedisTemplate를 이용해 직접적인 쿼리를 날리도록 했습니다.
    */
    private final RedisTemplate<String, Object> redisTemplate;
    private final RedissonClient redissonClient;

    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
    private final RoomCacheRepository roomCacheRepository;

    //TODO: 전체 트랜잭션 처리 Transactional or TransactionManager --> Transaction과 Lock 동시 불가, 내부 로직인 경우 불가
    @Nullable
    /*
        MySQL에서 영구적으로 저장하는 유저의 맵 데이터를 가져옵니다.
        맵 데이터는 json 형식으로 String으로 받아와서 Deserialize합니다.
    */
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

    public boolean updateUserMap(Integer userId, MapDto mapForUpdate) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty())
            return false;

        // 소유하고 있는 게임인지 확인하고 업데이트 하는 과정
        if(isOwnedGames(userId, mapForUpdate.getGameList())) {
            String mapJson = JsonUtil.toJson(mapForUpdate);
            if (mapJson == null)
                return false;

            user.get().updateMap(mapJson);
            userRepository.save(user.get());
            return true;
        } else {
            return false;
        }
    }

    // 소유하고 있는 게임인지 판단.
    private boolean isOwnedGames(Integer userId, List<String> gameList) {
        List<Integer> gameIds = gameList.stream()
                .map(Integer::parseInt)
                .collect(Collectors.toList());
        if(gameIds.isEmpty()) {
            return true;
        } else {
            List<Library> libraries = libraryRepository.findAllByUserIdAndGameIdIn(userId, gameIds);
            return gameIds.size() == libraries.size();
        }
    }

    /*
        입장 요청에 따른 Redis에 유저 정보 업데이트
        방 ID를 기준으로 다른 유저가 입장중이라면 대기하도록 락
    */
    public Room addUserToRedis(String roomId, String enteredUserId, UserDetails enteredUser) {
        RoomCache roomCache;
        RLock roomLock = redissonClient.getLock(PREFIX_OF_LOCK + roomId);
        try {
            roomLock.lockInterruptibly(EXPIRE_TIME_OF_LOCK, TIME_UNIT);

            Optional<RoomCache> opRoomCache = roomCacheRepository.findById(roomId);
            // TODO: UserMap 두번 select 하게됨 로직 고민 필요
            roomCache = opRoomCache.orElseGet(() -> Room.withMap(roomId, getUserMap(Integer.parseInt(roomId))).toHash());
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

    /*
        유저의 이동에 따른 Redis의 유저 정보 업데이트
        입장, 퇴장과 다르게 본인의 데이터만 수정하므로 분산 락 처리는 하지 않았습니다.
            아직 파악은 못했지만, 본인에 대한 여러 요청에 대해 hash.get() 시 데이터가 존재함에도 Null로 받아오는 문제가 발생했습니다.
            테스트 결과 2800번의 이동 요청 중 26번의 오류가 발생했습니다.
            이를 어떻게 해결할지는 고민중입니다.
        유저 위치에 대한 빠른 업데이트를 위해 RedisTemplate의 기능을 직접적으로 사용했습니다.
        현재는 맵의 사이즈가 고정되어 있어서 상수로 남겨놨지만, 나중에 유저마다 맵의 확장을 구매하여 처리할 수 있도록 하고싶습니다.
    */
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
        Optional<RoomCache> roomCache = roomCacheRepository.findById(roomId);
        if(roomCache.isEmpty())
            return null;
        return Room.of(roomCache.get());
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

    /*
        데이터 일치를 위해 맵 업데이트 시 유저 위치가 리셋되고, 맵 정보가 업데이트될 때까지 락을 걸기로 했습니다.
    */
    public boolean resetUserLocationAndUpdateMap(String roomId, MapDto map) {
        RLock roomLock = redissonClient.getLock(PREFIX_OF_LOCK + roomId);
        try {
            roomLock.lockInterruptibly(EXPIRE_TIME_OF_LOCK, TIME_UNIT);
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
