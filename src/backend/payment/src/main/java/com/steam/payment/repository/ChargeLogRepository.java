package com.steam.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChargeLogRepository extends JpaRepository<ChargeLog, Integer> {
}
