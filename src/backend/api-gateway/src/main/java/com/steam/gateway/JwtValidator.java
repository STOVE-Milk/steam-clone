package com.steam.gateway;


import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Component
public class JwtValidator {
    private static final String AUTHORIZATION_TYPE = "Bearer ";
    private static final Integer AUTHORIZATION_TYPE_LENGTH = 7;
    private final String key;

    public JwtValidator(@Value("${milk.jwt.secret}") String jwtSecret) {
        this.key = Base64.getEncoder().encodeToString(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /*
        Bearer 토큰이 맞는 지 확인
        JWT Secret Key를 이용해 Sign 검증
    */
    public boolean validate(String authorization) {
        if(!authorization.startsWith(AUTHORIZATION_TYPE))
                return false;

        String accessToken = authorization.substring(AUTHORIZATION_TYPE_LENGTH);

        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }

    //권한 정보 불러와서 필터링 할 때 사용 예정
    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    public Integer getAuthorizationTypeLength() {
        return AUTHORIZATION_TYPE_LENGTH;
    }
}
