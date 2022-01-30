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
