package com.steam.library.repository;

import com.steam.library.entity.RoomHash;
import org.springframework.data.repository.CrudRepository;

public interface RoomHashRepository extends CrudRepository<RoomHash, String> {
}
