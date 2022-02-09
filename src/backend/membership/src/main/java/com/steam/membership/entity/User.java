package com.steam.membership.entity;

import com.steam.membership.global.error.CustomException;
import com.steam.membership.global.error.ErrorCode;
import lombok.*;

import javax.persistence.*;
import javax.servlet.annotation.MultipartConfig;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Builder
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
    private Timestamp createdAt;

    @Column(name = "accessed_at")
    private Timestamp accessedAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Column(name = "deleted_at")
    private Timestamp deletedAt;

    @OneToMany(mappedBy = "user")
    List<Friend> friends = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    List<GuestBook> guestBooks = new ArrayList<>();
}
