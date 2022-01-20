package com.steam.membership.entity;

import lombok.Getter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
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

    @Column(name = "role")
    private Byte role;

    @Column(name = "money")
    private Double money;

    @Column(name = "profile")
    private String profile;

    @Column(name = "language")
    private String language;

    @Column(name = "country")
    private String country;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

    @Column(name = "accessed_at")
    private java.sql.Timestamp accessedAt;

    @Column(name = "updated_at")
    private java.sql.Timestamp updatedAt;

    @Column(name = "deleted_at")
    private java.sql.Timestamp deletedAt;

    @OneToMany(mappedBy = "user")
    @JoinColumn
    List<Friend> friends = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @JoinColumn
    List<FriendRequest> friendRequests = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    @JoinColumn
    List<GuestBook> guestBooks = new ArrayList<>();
}
