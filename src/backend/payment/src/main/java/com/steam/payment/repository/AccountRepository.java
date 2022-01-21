package com.steam.payment.repository;

import com.steam.payment.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByPublisherIdAndCountry(Integer publisherId, String country);
}
