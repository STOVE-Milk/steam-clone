package com.steam.membership.entity;

import lombok.Getter;

import javax.persistence.*;

@Getter
@Entity
@Table(name = "friend",
    uniqueConstraints={
            @UniqueConstraint(
                    columnNames={"user_id","friend_id"}
            )
    }
)
public class Friend {
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "friend_id")
    private User friend;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;
}
