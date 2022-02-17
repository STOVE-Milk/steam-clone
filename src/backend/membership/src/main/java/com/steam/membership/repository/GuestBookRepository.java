package com.steam.membership.repository;

import com.steam.membership.entity.GuestBook;
import com.steam.membership.entity.User;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GuestBookRepository extends JpaRepository<GuestBook, Integer> {
    List<GuestBook> findAllByUser(User user, Pageable pageable);
    Optional<GuestBook> findGuestBookByIdxAndUserAndGuest(Integer idx, User user, User guest);
}
