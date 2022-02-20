package com.steam.gateway.filter;

import com.steam.gateway.JwtValidator;
import lombok.Data;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GetMethodAuthorizationCheckFilter extends AbstractGatewayFilterFactory<GetMethodAuthorizationCheckFilter.Config>{
    private final JwtValidator jwtValidator;

    public GetMethodAuthorizationCheckFilter(JwtValidator jwtValidator) {
        super(Config.class);
        this.jwtValidator = jwtValidator;
    }

    /*
        유저 검색, 유저 프로필, 유저 방명록을 확인할 때는
        access token이 있을 경우에는 체크해주고 없으면 넘어가야 합니다.
        있을 경우에는 유저의 친구 여부를 따로 표현해주기 위해 분기 처리를 해주었습니다.

        이상적인 로직이라고 생각하지는 않고, 개선한다면 검증 없이 통과시키면서
        클라이언트 측에서 친구 목록을 유저 ID 리스트를 로그인 시에만 따로 받아와서 처리하도록 개선할 수 있을 것 같습니다.

        토큰 검증 - JwtValidator
        
        권한을 판별하는 것이 아닌 인가 여부를 판단하는 상황으로
        FORBIDDEN이 아닌 UNAUTHORIZED 상태 코드를 반환합니다.

        나중에 USER_ROLE에 의한 권한 판별의 경우 FORBIDDEN을 반환할 생각입니다.
    */
    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            List<String> authorization = exchange.getRequest().getHeaders().get("Authorization");

            if(authorization != null && !authorization.isEmpty()) {
                String accessToken = authorization.get(0);
                if(!jwtValidator.validate(accessToken)) {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }
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
