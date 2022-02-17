package com.steam.membership.global.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.steam.membership.global.common.UserDetails;

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

