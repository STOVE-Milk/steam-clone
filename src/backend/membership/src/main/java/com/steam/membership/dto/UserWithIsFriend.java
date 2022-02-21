package com.steam.membership.dto;

import java.time.LocalDateTime;
import java.util.Date;

public interface UserWithIsFriend {
    Integer getIdx();
    String getNickname();
    Integer getIsFriend();
    Integer getWasRequested();
    String getProfile();
    LocalDateTime getAccessedAt();
    LocalDateTime getCreatedAt();
}
