package com.steam.payment.controller;

import com.steam.payment.dto.PurchaseGamesRequest;
import com.steam.payment.dto.PurchaseGamesResponse;
import com.steam.payment.global.common.Body;
import com.steam.payment.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequiredArgsConstructor
@RestController
@RequestMapping("/payment")
public class PurchaseController {
    private final PurchaseService purchaseService;

    @PostMapping("/cart/purchase")
    @ResponseBody
    public ResponseEntity<Body<Object>> purchase(@Valid @RequestBody PurchaseGamesRequest request) {
        PurchaseGamesResponse response = purchaseService.purchaseGames(request);
        purchaseService.deletePurchasedGamesInWishlist(response.getGameIds());
        return ResponseEntity.ok(
                Body.success(response)
        );
    }
}
