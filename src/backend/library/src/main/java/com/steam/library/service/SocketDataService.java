package com.steam.library.service;

import com.steam.library.dto.MapDto;
import com.steam.library.entity.User;
import com.steam.library.global.util.JsonUtil;
import com.steam.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
@Service
public class SocketDataService {
    private final UserRepository userRepository;

    @Nullable
    public MapDto getUserMap(Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        if(user.isEmpty()) {
            log.info("유저 없음");
            return null;
        }

        String mapJson = user.get().getMap();
        if(mapJson.isBlank()) {
            log.info("map 데이터 없음");
            mapJson = JsonUtil.toJson(MapDto.newMap());
            user.get().updateMap(mapJson);
            userRepository.save(user.get());
        }

        return JsonUtil.toObject(mapJson, MapDto.class);
    }
}
