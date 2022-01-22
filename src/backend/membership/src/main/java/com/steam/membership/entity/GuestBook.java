package com.steam.membership.entity;

import lombok.*;

import javax.persistence.*;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "guest_book")
public class GuestBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Integer idx;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "guest_id")
    private Integer guestId;

    @Column(name = "displayed_name")
    private String displayedName;

    @Column(name = "content")
    private String content;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

    @Column(name = "updated_at")
    private java.sql.Timestamp updatedAt;
}