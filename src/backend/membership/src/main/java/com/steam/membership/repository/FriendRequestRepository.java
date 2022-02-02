package com.steam.membership.repository;

import com.steam.membership.entity.FriendRequest;
import com.steam.membership.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {
    Optional<FriendRequest> findBySenderAndReceiver(User sender, User receiver);

    @Query("SELECT fr from FriendRequest fr WHERE fr.idx = :idx AND (fr.sender = :user OR fr.receiver = :user)")
    Optional<FriendRequest> findByIdAndUser(@Param("idx") Integer idx, @Param("user") User user);
    List<FriendRequest> findAllBySender(User sender);
    List<FriendRequest> findAllByReceiver(User receiver);
}
