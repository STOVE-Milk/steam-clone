package com.steam.payment.entity;

import com.steam.payment.dto.GameDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Integer idx;

    @Column(name = "publisher_id")
    private Integer publisherId;

    @Column(name = "money")
    private Double money;

    @Column(name = "country")
    private String country;

    @Column(name = "is_valid")
    private Boolean isValid;

    public void addMoney(GameDto game) {
        this.money += game.getSalePrice();
    }
}
