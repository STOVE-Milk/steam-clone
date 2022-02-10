package com.steam.payment.repository;

import com.steam.payment.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import javax.persistence.LockModeType;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    /*
        Lock
        Publisher의 계좌는 여러 유적가 게임 구매 시 Lost Update 문제가 발생한다.
        다른 트랜잭션이 수정하는 동안 Read하지 못하도록 Exclusive Lock 설정을 한다.
        SELECT FOR UPDATE 쿼리를 통해 정합성을 보장한다.
     */

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Account> findByPublisherIdAndCountry(Integer publisherId, String country);
}
