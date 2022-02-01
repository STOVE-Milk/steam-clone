package com.steam.membership.dto;


import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.steam.membership.entity.GuestBook;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GuestBookResponse {
    List<GuestBookDto> guestBooks;

    public static GuestBookResponse of(final List<GuestBook> guestBooks) {
        return GuestBookResponse.builder()
                .guestBooks(guestBooks.stream()
                        .map(GuestBookDto::of)
                        .collect(Collectors.toList())
                ).build();
    }
}
