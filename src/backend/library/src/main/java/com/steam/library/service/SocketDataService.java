package com.steam.library.service;

import com.steam.library.dto.MapDto;
import com.steam.library.dto.Room;
import com.steam.library.entity.RoomHash;
import com.steam.library.entity.User;
import com.steam.library.global.util.JsonUtil;
import com.steam.library.repository.RoomHashRepository;
import com.steam.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
@Service
public class SocketDataService {
    private final UserRepository userRepository;
    private final RoomHashRepository roomHashRepository;

    @Nullable
    public MapDto getUserMap(Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty()) {
            log.info("유저 없음");
            return null;
        }

        String mapJson = user.get().getMap();
        if(mapJson == null || mapJson == "" || mapJson == "{}") {
            log.info("map 데이터 없음");
            MapDto newMap = MapDto.newMap();
            user.get().updateMap(JsonUtil.toJson(newMap));
            userRepository.save(user.get());
            return newMap;
        }

        return JsonUtil.toMapDto(mapJson);
    }

    public Room getRoomData(String roomId, Integer userId) {
        Optional<RoomHash> roomHash = roomHashRepository.findById(roomId);
        if(roomHash.isPresent()) {
            return Room.of(roomHash.get());
        } else {
            MapDto mapDto = getUserMap(userId);
            List<String> games = new ArrayList<>();
            mapDto.getGames().forEach((key, value) -> games.add(key));
            return Room.builder()
                    .roomId(Integer.parseInt(roomId))
                    .gameList(games)
                    .userList(new ArrayList<>())
                    .users(new HashMap<>())
                    .map(mapDto)
                    .build();
        }
    }

}
