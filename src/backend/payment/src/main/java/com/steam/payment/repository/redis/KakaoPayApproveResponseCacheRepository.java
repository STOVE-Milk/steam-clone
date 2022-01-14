package com.steam.payment.repository.redis;


import com.steam.payment.entity.redis.KakaoPayApproveResponseCache;
import org.springframework.data.repository.CrudRepository;

public interface KakaoPayApproveResponseCacheRepository extends CrudRepository<KakaoPayApproveResponseCache, String> {

}
