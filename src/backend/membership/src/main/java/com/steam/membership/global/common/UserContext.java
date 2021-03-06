package com.steam.membership.global.common;

import com.steam.membership.entity.User;

public class UserContext {
    private static boolean isLogined = false;
    private static final ThreadLocal<UserDetails> userContextHolder = new ThreadLocal<UserDetails>();

    public static boolean isLoginedUser() {
        return isLogined;
    }

    public static UserDetails getUserDetails() {
        return userContextHolder.get();
    }

    public static Integer getUserId() {
        return userContextHolder.get().getIdx();
    }

    public static User getUser() {
        return User.builder().idx(userContextHolder.get().getIdx()).build();
    }

    public static void setUserDetails(UserDetails userDetails) {
        userContextHolder.set(userDetails);
        isLogined = true;
    }

    public static void removeUserDetails() {
        userContextHolder.remove();
        isLogined = false;
    }
}

