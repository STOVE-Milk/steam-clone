package com.steam.library.global.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.lang.Nullable;
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
            e.printStackTrace();
            return null;
        }
    }

    @Nullable
    public static <T> T toObject(String json, Class<T> tClass) {
        try {
            return objectMapper.readValue(json, tClass);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    //Mapper? 따로 분리해야할듯
    public Map<String, String> of(Object data) {
        return objectMapper.convertValue(data, new TypeReference<>() {});
    }
}
