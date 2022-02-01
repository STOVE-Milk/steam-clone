package com.steam.payment.dto.kakaopay;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class CardInfo {
      private String interestFreeInstall;
      private String bin;
      private String cardType;
      private String cardMid;
      private String approvedId;
      private String installMonth;
      private String purchaseCorp;
      private String purchaseCorpCode;
      @JsonIgnore
      private String issureCode;
      @JsonIgnore
      private String issuerCorpCode;
      @JsonIgnore
      private String kakaopayPurchaseCorp;
      @JsonIgnore
      private String kakaopayPurchaseCorpCode;
      @JsonIgnore
      private String kakaopayIssureCode;
      @JsonIgnore
      private String kakaopayIssuerCorpCode;
}
