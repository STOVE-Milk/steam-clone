package com.steam.payment.entity.mongodb;

import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.dto.kakaopay.KakaoPayApproveResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Builder
@Getter
public class ChargeDoc {
    private String method;
    private Double beforeMoney;
    private Double afterMoney;
    private GiftcardDto giftcard;
    private String status;
    private Date createdAt;

    public void successApproval(Double money) {
        this.beforeMoney = money;
        this.afterMoney = money;
        this.status = "APPROVAL SUCCESSED";
        this.createdAt = new Date();
    }

    public void successAll(Double afterMoney) {
        this.afterMoney = afterMoney;
        this.status = "ALL SUCCESSED";
        this.createdAt = new Date();
    }

    public void cancel() {
        this.status = "CANCLED";
        this.createdAt = new Date();
    }
}
