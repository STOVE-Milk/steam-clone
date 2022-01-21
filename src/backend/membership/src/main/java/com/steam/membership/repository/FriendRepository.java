package com.steam.membership.repository;

import com.steam.membership.entity.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Map<Integer, Integer>> {
    @Query("SELECT * FROM Friend f WHERE (f.userId = :userId AND f.friendId = :friendId) OR f.userId = :friendId AND f.friendId = :userId")
    public List<Friend> findFriendsByUserIdAndFriendId(@Param("userId") Integer userId, @Param("friendId") Integer friendId);
}
