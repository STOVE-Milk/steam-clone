package com.steam.membership.repository;

import com.steam.membership.entity.Friend;
import com.steam.membership.entity.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Map<Integer, Integer>> {
    @Query("SELECT f FROM Friend f WHERE (f.user.idx = :userId AND f.friend.idx = :friendId) OR (f.user.idx = :friendId AND f.friend.idx = :userId)")
    List<Friend> findFriendsByUserIdAndFriendId(@Param("userId") Integer userId, @Param("friendId") Integer friendId);
    @Query(value = "SELECT * FROM steam.friend f1 " +
            "INNER JOIN steam.friend f2 " +
            "ON (f1.friend_id = f2.friend_id AND f2.user_id = :userId ) " +
            "WHERE (f1.user_id = :myId ) " +
            "LIMIT 20", nativeQuery = true)
    List<Friend> findFriendsTop20ByUserId(@Param("myId") Integer myId, @Param("userId") Integer userId);

    Optional<Friend> findByUserAndFriend(User user, User friend);
    List<Friend> findTop20ByUser(User user);
    List<Friend> findAllByUser(User user);

}
