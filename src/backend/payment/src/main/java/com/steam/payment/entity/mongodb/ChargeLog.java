package com.steam.payment.entity.mongodb;

import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.dto.kakaopay.KakaoPayApproveResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Builder
@Getter
public class ChargeLog {
    private String method;
    private Double beforeMoney;
    private Double afterMoney;
    private GiftcardDto giftcard;
    private String status;
    private Date createdAt;

    public void initializeMoney(Double money) {
        this.beforeMoney = money;
        this.afterMoney = money;
    }
    public void setAfterMoney(Double money) {
        this.afterMoney = money;
    }

    public void successApproval() {
        this.status = "APPROVAL SUCCESSED";
        this.createdAt = new Date();
    }

    public void successAll() {
        this.status = "ALL SUCCESSED";
        this.createdAt = new Date();
    }

    public void cancel() {
        this.status = "CANCLED";
        this.createdAt = new Date();
    }
}
