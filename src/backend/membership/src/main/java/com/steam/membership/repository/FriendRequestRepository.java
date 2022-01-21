package com.steam.membership.repository;

import com.steam.membership.entity.FriendRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {
    Optional<FriendRequest> findByIdAndReceiverId(Integer idx, Integer receiverId);
}
