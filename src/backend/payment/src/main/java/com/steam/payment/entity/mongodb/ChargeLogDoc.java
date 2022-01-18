package com.steam.payment.entity.mongodb;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.payment.dto.GiftcardDto;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.ArrayList;
import java.util.List;

@Builder
@Getter
@Document(collection = "charge_log")
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ChargeLogDoc {
    @Id
    private String id;
    private Integer chargeCount;
    private List<ChargeDoc> chargeDocs;

    public static ChargeLogDoc newUser(Integer userId) {
        return ChargeLogDoc.builder()
                .id(userId.toString())
                .chargeCount(0)
                .chargeDocs(new ArrayList<>())
                .build();
    }

    public void plusCount() {
        this.chargeCount++;
    }

    public ChargeDoc getLastChargeDoc() {
        return this.chargeDocs.get(this.chargeCount - 1);
    }
}
