package com.steam.payment.repository;

import com.steam.payment.entity.Giftcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiftcardRepository extends JpaRepository<Giftcard, Integer> {
    List<Giftcard> findAllByCountry(String Country);
}
