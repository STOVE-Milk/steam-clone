package com.steam.payment.global.common;

/*
    Spring Security에서 SecurityContextHolder에 정보를 저장하는 방법을 찾아보고 해당 부분만 따로 가져와서 사용했습니다.
    인가, 검증은 API Gateway에서 완료됐다고 판단하여 Spring Security를 사용하지 않았습니다.

    ThreadLocal을 사용하여 유저 정보를 담을 객체를 선언하고, 쓰레드 내에서 전역적으로 사용합니다.
    쓰레드 풀을 사용할 경우 연결 종료 시에도 유저 정보 유지 문제가 발생해
    JwtFilter에서 Destroy 시 UserContextHolder를 삭제합니다.
*/
public class UserContext {
    private static final ThreadLocal<UserDetails> userContextHolder = new ThreadLocal<UserDetails>();

    public static UserDetails getUserDetails() {
        return userContextHolder.get();
    }

    public static Integer getUserId() {
        return userContextHolder.get().getIdx();
    }

    public static String getUserCountry() {
        return userContextHolder.get().getCountry();
    }

    public static void setUserDetails(UserDetails userDetails) {
        userContextHolder.set(userDetails);;
    }

    public static void removeUserDetails() {
        userContextHolder.remove();
    }
}
