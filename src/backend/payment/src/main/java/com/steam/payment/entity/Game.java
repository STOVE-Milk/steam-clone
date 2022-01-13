package com.steam.payment.entity;

import lombok.Getter;

import javax.persistence.*;

@Getter
@Entity
@Table(name = "game")
public class Game {
    @Id
    @Column(name = "idx")
    private Integer idx;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private Double price;

    @Column(name = "sale")
    private Integer sale;

    @Column(name = "image")
    private String image;

    @Column(name = "video")
    private String video;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(name = "recommend_count")
    private Integer recommendCount;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

    @Column(name = "updated_at")
    private java.sql.Timestamp updatedAt;
}
