package com.steam.payment.global.common;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/*
    비어있는 데이터를 Response Body로 줘야할 경우 이 객체를 이용합니다.
*/
@JsonSerialize
public class EmptyData {
}
