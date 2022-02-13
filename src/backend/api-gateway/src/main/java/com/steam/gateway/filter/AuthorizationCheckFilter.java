package com.steam.gateway.filter;

import com.steam.gateway.JwtValidator;
import lombok.Data;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AuthorizationCheckFilter extends AbstractGatewayFilterFactory<AuthorizationCheckFilter.Config>{
    private final JwtValidator jwtValidator;

    public AuthorizationCheckFilter(JwtValidator jwtValidator) {
        super(Config.class);
        this.jwtValidator = jwtValidator;
    }

    /*
        헤더의 authorization이 비어 있는지 검증
        토큰 검증 - JwtValidator
        
        권한을 판별하는 것이 아닌 인증이 제대로 되었나 판단하는 상황으로
        FORBIDDEN이 아닌 UNAUTHORIZED 상태 코드를 반환합니다.

        나중에 USER_ROLE에 의한 권한 판별의 경우 FORBIDDEN을 반환할 생각입니다.
    */
    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            List<String> authorization = exchange.getRequest().getHeaders().get("Authorization");

            if(authorization == null || authorization.get(0).isBlank()) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String accessToken = authorization.get(0);
            if(!jwtValidator.validate(accessToken)) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            return chain.filter(exchange);
        });
    }

    @Data
    public static class Config {
        private String baseMessage;
        private boolean preLogger;
        private boolean postLogger;
    }
}
