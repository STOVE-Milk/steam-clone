package com.steam.membership.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.membership.entity.GuestBook;
import com.steam.membership.global.util.JsonUtil;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Builder
@Getter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GuestBookDto {
    private Integer id;
    private Integer guestId;
    private String displayedName;
    private ProfileDto proflie;
    private String content;
    private Date createdAt;

    public static GuestBookDto of(GuestBook guestBook) {
        return GuestBookDto.builder()
                .id(guestBook.getIdx())
                .guestId(guestBook.getGuest().getIdx())
                .displayedName(guestBook.getDisplayedName())
                .proflie(JsonUtil.toObject(guestBook.getGuest().getProfile(), ProfileDto.class))
                .content(guestBook.getContent())
                .createdAt(guestBook.getCreatedAt())
                .build();
    }
}
