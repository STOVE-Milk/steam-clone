package com.steam.payment.entity;

import lombok.*;

import javax.persistence.*;

@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "charge_log")
public class ChargeLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idx")
    private Integer idx;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "giftcard_id")
    private Integer giftcardId;

    @Column(name = "status")
    private Integer status;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

}
