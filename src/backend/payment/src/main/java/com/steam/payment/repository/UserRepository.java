package com.steam.payment.repository;

import com.steam.payment.entity.Balance;
import com.steam.payment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u.money AS money FROM User u WHERE u.idx = :userId")
    Balance findBalanceByUserId(@Param("userId") Integer userId);
}
