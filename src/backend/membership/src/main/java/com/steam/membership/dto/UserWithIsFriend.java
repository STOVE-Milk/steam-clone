package com.steam.membership.dto;

import java.util.Date;

public interface UserWithIsFriend {
    Integer getIdx();
    String getNickname();
    Integer getIsFriend();
    Integer getWasRequested();
    String getProfile();
    Date getAccessedAt();
    Date getCreatedAt();
}
