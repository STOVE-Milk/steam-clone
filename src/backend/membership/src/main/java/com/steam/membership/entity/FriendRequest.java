package com.steam.membership.entity;

import lombok.Getter;

import javax.persistence.*;

@Getter
@Entity
@Table(name = "friend_request")
public class FriendRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Integer idx;

    //TODO 컬럼 이름 변경
    //sender
    @Column(name = "user_id")
    private Integer senderId;

    //receiver
    @Column(name = "requester_id")
    private Integer receiverId;



    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;
}
