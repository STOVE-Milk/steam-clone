package com.steam.payment.entity;

import javax.persistence.*;

@Entity
@Table(name = "purchase_log")
public class PurchaseLog {
    @Id
    @Column(name = "idx")
    private Integer idx;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "game_id")
    private Integer gameId;

    @Column(name = "price")
    private Double price;

    @Column(name = "sale")
    private Integer sale;

    @Column(name = "country")
    private String country;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;
}
