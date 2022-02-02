package com.steam.payment.repository.redis;

import com.steam.payment.entity.redis.KakaoPayReadyCache;
import org.springframework.data.repository.CrudRepository;


public interface KakaoPayReadyCacheRepository extends CrudRepository<KakaoPayReadyCache, String> {

}
