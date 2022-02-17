package com.steam.payment.global.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.steam.payment.global.common.UserDetails;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;

public class JwtUtil {
    public static UserDetails getPayload(String token) {
        ObjectMapper objectMapper = new ObjectMapper();
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String[] chunk = token.split("\\.");
        String payload = new String(decoder.decode(chunk[1]));
        try {
            return objectMapper.readValue(payload, UserDetails.class);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }
}
