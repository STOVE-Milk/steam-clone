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
    @Query(value = "SELECT u.idx, u.nickname, f.idx IS NOT NULL as 'isFriend', fr.idx IS NOT NULL 'wasRequested', u.`profile`, u.accessed_at as accessedAt, u.created_at as createdAt FROM user u " +
            "LEFT JOIN friend f " +
            "ON (f.user_id = :userId AND u.idx = f.friend_id) " +
            "LEFT JOIN friend_request fr " +
            "ON (fr.user_id = :userId AND u.idx = fr.requester_id) " +
            "WHERE u.nickname LIKE CONCAT(:nickname ,'%') AND u.deleted_at IS NULL AND u.idx != :userId " +
            "ORDER BY u.nickname " +
            "LIMIT :start ,:size", nativeQuery = true)
    List<UserWithIsFriend> findAllByNicknameStartsWith(@Param("userId") Integer userId, @Param("nickname") String nickname, @Param("start") Integer start, @Param("size") Integer size);

    @Query(value = "SELECT u.idx, u.nickname, NULL IS NOT NULL as 'isFriend', NULL IS NOT NULL as 'wasRequested', u.`profile`, u.accessed_at as accessedAt, u.created_at as createdAt FROM user u " +
            "WHERE u.deleted_at IS NULL AND u.nickname LIKE CONCAT(:nickname ,'%') " +
            "ORDER BY u.nickname " +
            "LIMIT :start ,:size", nativeQuery = true)
    List<UserWithIsFriend> findAllByNicknameStartsWith(@Param("nickname") String nickname, @Param("start") Integer start, @Param("size") Integer size);
}
