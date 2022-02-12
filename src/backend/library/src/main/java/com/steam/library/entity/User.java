package com.steam.library.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "user")
public class User {
    @Id
    @Column(name = "idx")
    private Integer idx;

    @Column(name = "email")
    private String email;

    @Column(name = "username")
    private String username;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "map")
    private String map;

    @Column(name = "profile")
    private String profile;

    @Column(name = "deleted_at")
    private java.sql.Timestamp deletedAt;

    public void updateMap(String map) {
        this.map = map;
    }
}
