package com.steam.membership.entity;

import lombok.*;

import javax.persistence.*;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "friend_id")
    private User friend;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;
}
