package com.steam.payment.repository;

import com.steam.payment.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    @Transactional
    @Modifying
    @Query("DELETE FROM Wishlist w WHERE (w.userId = :userId AND w.gameId IN :gameIds)")
    void deleteAllByUserIdAndGameIdIn(@Param("userId") Integer userId, @Param("gameIds") List<Integer> gameIds);
}
