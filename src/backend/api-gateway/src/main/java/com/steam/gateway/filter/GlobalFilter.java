package com.steam.gateway.filter;
import lombok.Data;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Date;

@Component
public class GlobalFilter extends AbstractGatewayFilterFactory<GlobalFilter.Config> {
    private static final Logger logger = LogManager.getLogger(GlobalFilter.class);

    public GlobalFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain) -> {
            long now = System.currentTimeMillis();
            if (config.isPreLogger()) {
                logger.info(exchange.getRequest());
            }
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                if (config.isPostLogger()) {
                    logger.info("request: " + exchange.getRequest().getMethod() + " " + exchange.getRequest().getPath() + " " + (System.currentTimeMillis() - now));
                }
            }));
        });
    }

    @Data
    public static class Config {
        private String baseMessage;
        private boolean preLogger;
        private boolean postLogger;
    }
}
