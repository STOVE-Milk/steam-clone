package com.steam.membership.repository;

import com.steam.membership.entity.Friend;
import com.steam.membership.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Map<Integer, Integer>> {
    @Query("SELECT f FROM Friend f WHERE (f.user.idx = :userId AND f.friend.idx = :friendId) OR (f.user.idx = :friendId AND f.user.idx = :userId)")
    public List<Friend> findFriendsByUserIdAndFriendId(@Param("userId") Integer userId, @Param("friendId") Integer friendId);

    public Optional<Friend> findByUserAndFriend(User user, User friend);
    public List<Friend> findTop20ByUser(User user);
    public List<Friend> findAllByUser(User user);
}
