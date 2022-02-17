package com.steam.payment.entity;

import com.steam.payment.global.util.JsonUtil;
import lombok.*;

import javax.persistence.*;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "game")
public class Game {
    @Id
    @Column(name = "idx")
    private Integer idx;

    @Column(name = "publisher_id")
    private Integer publisherId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private String price;

    @Column(name = "sale")
    private Integer sale;

    public Double priceOf(String country) {
        return Double.parseDouble(JsonUtil.parse(this.price, country).toString());
    }
}
