package com.steam.payment.dto;

import com.steam.payment.entity.Giftcard;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Builder
public class GiftcardDto {
    @NotNull
    private Integer idx;
    @NotBlank
    private String name;
    @NotNull
    private Integer price;

    public static GiftcardDto of(Giftcard giftcard) {
        return GiftcardDto.builder()
                .idx(giftcard.getIdx())
                .name(giftcard.getName())
                .price(giftcard.getPrice())
                .build();
    }
}
