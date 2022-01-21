package com.steam.payment.global.common;

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
