package com.steam.payment.entity;

import com.steam.payment.global.util.JsonUtil;
import lombok.*;

import javax.persistence.*;

@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "game")
public class Game {
    @Id
    @Column(name = "idx")
    private Integer idx;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private String price;

    @Column(name = "sale")
    private Integer sale;

    public Integer getIdx() {
        return idx;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getPrice() {
        return price;
    }

    public Integer getSale() {
        return sale;
    }

    public Double priceOf(String country) {
        return Double.parseDouble(JsonUtil.parse(this.price, country).toString());
    }
}
