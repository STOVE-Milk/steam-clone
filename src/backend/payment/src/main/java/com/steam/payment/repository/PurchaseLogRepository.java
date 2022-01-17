package com.steam.payment.repository;

import com.steam.payment.entity.PurchaseLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseLogRepository extends JpaRepository<PurchaseLog, Integer> {
}
