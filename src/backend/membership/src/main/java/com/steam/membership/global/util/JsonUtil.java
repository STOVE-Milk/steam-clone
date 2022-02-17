package com.steam.membership.global.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.steam.membership.global.error.CustomException;
import com.steam.membership.global.error.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
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

    public static <T> T toObject(String json, Class<T> tClass) {
        try {
            return objectMapper.readValue(json, tClass);
        } catch (JsonProcessingException e) {
            throw new CustomException(ErrorCode.JSON_PARSE_EXCEPTION);
        }
    }

    //Mapper? 따로 분리해야할듯
    public Map<String, String> of(Object data) {
        return objectMapper.convertValue(data, new TypeReference<>() {});
    }
}
