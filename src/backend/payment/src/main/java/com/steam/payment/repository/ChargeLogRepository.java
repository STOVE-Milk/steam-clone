package com.steam.payment.repository;

import com.steam.payment.entity.mongodb.ChargeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChargeLogRepository extends JpaRepository<ChargeLog, Integer> {
}
