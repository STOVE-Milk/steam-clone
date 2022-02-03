package com.steam.payment.dto.kakaopay;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class KakaoPayReadyResponse {
    private String tid;
    @JsonIgnore
    private String tmsResult;
    @JsonIgnore
    private String nextRedirectAppUrl;
    @JsonIgnore
    private String nextRedirectMobileUrl;
    private String nextRedirectPcUrl;
    @JsonIgnore
    private String androidAppScheme;
    @JsonIgnore
    private String iosAppScheme;
    private String createdAt;
}
