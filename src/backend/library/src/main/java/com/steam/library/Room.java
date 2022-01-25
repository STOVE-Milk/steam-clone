package com.steam.library;

import com.steam.library.dto.MapDto;
import com.steam.library.dto.UserDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Room {
    private List<Integer> gameList = new ArrayList<>();
    private List<Integer> userList = new ArrayList<>();
    private Map<String, UserDto> users;
    private MapDto map;
}
