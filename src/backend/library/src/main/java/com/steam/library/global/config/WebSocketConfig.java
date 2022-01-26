package com.steam.library.global.config;

import com.steam.library.LibraryWebSocketHandler;
import com.steam.library.global.interceptor.WebSocketHandshakeInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Bean
    public LibraryWebSocketHandler libraryWebSocketHandler() {
        return new LibraryWebSocketHandler();
    };

    @Bean
    public WebSocketHandshakeInterceptor webSocketHandshakeInterceptor() {
        return new WebSocketHandshakeInterceptor();
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(libraryWebSocketHandler(), "/library")
                .addInterceptors(new HttpSessionHandshakeInterceptor())
                .setAllowedOrigins("*");
    }
}
