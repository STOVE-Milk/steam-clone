package com.steam.payment.global.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.steam.payment.entity.vo.ProfileJson;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.io.IOException;

@Converter(autoApply = true)
public class JpaConverterJson implements AttributeConverter<ProfileJson, String> {

    private final static ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(ProfileJson profile) {
        try {
            return objectMapper.writeValueAsString(profile);
        } catch (JsonProcessingException ex) {
            throw new CustomException(ErrorCode.JPA_JSON_CONVERTER_EXCEPTION);
        }
    }

    @Override
    public ProfileJson convertToEntityAttribute(String json) {
        try {
            return objectMapper.readValue(json, ProfileJson.class);
        } catch (IOException ex) {
            throw new CustomException(ErrorCode.JPA_JSON_CONVERTER_EXCEPTION);
        }
    }

}
