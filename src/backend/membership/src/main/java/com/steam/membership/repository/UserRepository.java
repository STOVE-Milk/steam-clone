package com.steam.membership.repository;

import com.steam.membership.dto.UserWithIsFriend;
import com.steam.membership.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query(value = "SELECT u.idx, u.nickname, f.idx IS NOT NULL as 'friends', u.`profile`, u.accessed_at as accessedAt, u.created_at as createdAt FROM user u " +
            "LEFT JOIN friend f " +
            "ON (f.user_id = :userId AND u.idx = f.friend_id) " +
            "WHERE u.deleted_at IS NULL AND u.nickname LIKE CONCAT(:nickname ,'%') " +
            "ORDER BY u.nickname " +
            "LIMIT :start ,:size", nativeQuery = true)
    List<UserWithIsFriend> findAllByNicknameStartsWith(@Param("userId") Integer userId, @Param("nickname") String nickname, @Param("start") Integer start, @Param("size") Integer size);
}
