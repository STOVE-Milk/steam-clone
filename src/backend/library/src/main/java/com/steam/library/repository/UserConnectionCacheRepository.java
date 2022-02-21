package com.steam.library.repository;

import com.steam.library.entity.UserConnectionCache;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserConnectionCacheRepository extends CrudRepository<UserConnectionCache, String> {
}
