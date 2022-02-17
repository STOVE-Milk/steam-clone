package com.steam.payment.entity.mongodb;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.ArrayList;
import java.util.List;

/*
    결제 로그 도큐먼트 입니다.
    충전과 결제 로그를 통합하고 싶은 생각이 있는데, 아직 실현하지 못했습니다.
*/
@Builder
@Getter
@Document(collection = "purchase_log")
public class PurchaseLogDocument {
    @Id
    private String id;
    private Integer count;
    private List<PurchaseLog> purchaseLogs;

    public static PurchaseLogDocument newUser(Integer userId) {
        return PurchaseLogDocument.builder()
                .id(userId.toString())
                .count(0)
                .purchaseLogs(new ArrayList<>())
                .build();
    }

    public void addLog(PurchaseLog log) {
        this.purchaseLogs.add(log);
        this.count++;
    }

    public PurchaseLog getLastPurchaseLog() {
        if(count.equals(0))
            return PurchaseLog.builder().build();
        return this.purchaseLogs.get(this.count - 1);
    }
}
