package com.steam.payment.global.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class JsonUtil {
    private static final JSONParser jsonParser = new JSONParser();
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static Object parse(String json, String attribute) {
        try {
            JSONObject parsedJson = (JSONObject) jsonParser.parse(json);
            return parsedJson.get(attribute);
        } catch (ParseException | ClassCastException e) {
            throw new CustomException(ErrorCode.JSON_PARSE_EXCEPTION);
        }
    }

    private <T> T toObject(String json, Class<T> tClass) throws JsonProcessingException {
        return objectMapper.readValue(json, tClass);
    }

    //Mapper? 따로 분리해야할듯
    public Map<String, String> of(Object data) {
        return objectMapper.convertValue(data, new TypeReference<>() {});
    }
}
