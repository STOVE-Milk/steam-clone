package com.steam.payment.entity;

/*
    유저 잔액 확인 기능이 필요하여 잔액 정보만 가져올 수 있는 인터페이스를 만들었습니다.
    JPA Projection을 통해 잔액 정보만 가져옵니다.
*/
public interface Balance {
    Double getMoney();
}
