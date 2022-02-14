package com.steam.library.entity;

import lombok.*;

import javax.persistence.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "library")
public class Library {
    @Id
    @Column(name = "idx")
    private Integer idx;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "game_id")
    private Integer gameId;

    @Column(name = "is_visible")
    private Boolean isVisible;

    @Column(name = "play_time")
    private Integer playTime;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

    @Column(name = "updated_at")
    private java.sql.Timestamp updatedAt;
}
