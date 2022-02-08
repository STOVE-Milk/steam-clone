package com.steam.membership.dto;

import java.util.Date;

public interface UserWithIsFriend {
    Integer getIdx();
    String getNickname();
    Integer getFriend();
    String getProfile();
    Date getAccessedAt();
    Date getCreatedAt();
}
