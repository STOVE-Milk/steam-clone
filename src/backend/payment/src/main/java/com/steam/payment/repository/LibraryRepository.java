package com.steam.payment.repository;

import com.steam.payment.entity.Library;
import com.steam.payment.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibraryRepository extends JpaRepository<Library, Integer> {
    @Query("SELECT l FROM Library l WHERE ( l.user = :user AND l.gameId IN :gameIds ) ")
    List<Library> findAllByUserAndGameId(@Param("user") User user,@Param("gameIds") List<Integer> gameIds);
}
