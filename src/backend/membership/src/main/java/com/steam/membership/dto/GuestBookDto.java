package com.steam.membership.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.membership.entity.GuestBook;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;

@Builder
@Getter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GuestBookDto {
    private Integer idx;
    private Integer guestId;
    private String displayedName;
    private String proflie;
    private String content;
    private Date createdAt;

    public static GuestBookDto of(GuestBook guestBook) {
        return GuestBookDto.builder()
                .idx(guestBook.getIdx())
                .guestId(guestBook.getGuest().getIdx())
                .displayedName(guestBook.getDisplayedName())
                .proflie(guestBook.getGuest().getProfile())
                .content(guestBook.getContent())
                .createdAt(guestBook.getCreatedAt())
                .build();
    }
}
