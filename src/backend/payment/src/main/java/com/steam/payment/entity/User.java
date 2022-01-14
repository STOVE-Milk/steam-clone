package com.steam.payment.entity;

import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;

@Builder
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Integer idx;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "username")
    private String username;

    @Column(name = "nickname")
    private String nickname;

    @Column(name = "role")
    private Integer role;

    @Column(name = "money")
    private Double money;

    //description, image
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
    @UpdateTimestamp
    private java.sql.Timestamp updatedAt;

    public void chargeMoney(Integer value) {
        this.money += value;
    }
}
