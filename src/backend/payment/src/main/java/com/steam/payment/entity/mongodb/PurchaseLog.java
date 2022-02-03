package com.steam.payment.entity.mongodb;

import com.steam.payment.dto.GameDto;
import com.steam.payment.dto.GiftcardDto;
import com.steam.payment.entity.User;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;
import java.util.List;

@Builder
@Getter
public class PurchaseLog {
    private String method;
    private Double totalPrice;
    private Double beforeMoney;
    private Double afterMoney;
    private List<GameDto> games;
    private String status;
    private Date createdAt;

    public static PurchaseLog of(Double userMoney, List<GameDto> games, Double totalPrice) {
        return PurchaseLog.builder()
                .method("money")
                .totalPrice(totalPrice)
                .beforeMoney(userMoney)
                .afterMoney(userMoney)
                .games(games)
                .status("READY")
                .createdAt(new Date())
                .build();
    }

    public void success(Double totalPrice) {
        this.afterMoney -= totalPrice;
        this.status = "SUCCESS";
        this.createdAt = new Date();
    }
}
