package com.steam.payment.entity.mongodb;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.Singular;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Document(collection = "charge_log")
public class ChargeLogDocument {
    @Id
    private String id;
    private Integer count;
    private List<ChargeLog> chargeLogs;

    public static ChargeLogDocument newUser(Integer userId) {
        return ChargeLogDocument.builder()
                .id(userId.toString())
                .count(0)
                .chargeLogs(new ArrayList<>())
                .build();
    }

    public void plusCount() {
        this.count++;
    }

    public ChargeLog getLastChargeLog() {
        if(count.equals(0))
            return ChargeLog.builder().build();
        return this.chargeLogs.get(this.count - 1);
    }
}
