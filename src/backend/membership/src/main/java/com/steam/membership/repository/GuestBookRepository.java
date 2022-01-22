package com.steam.membership.repository;

import com.steam.membership.entity.GuestBook;
import com.steam.membership.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuestBookRepository extends JpaRepository<GuestBook, Integer> {
    public Optional<GuestBook> findGuestBookByIdxAndUserAndGuest(Integer idx, User user, User guest)
}
