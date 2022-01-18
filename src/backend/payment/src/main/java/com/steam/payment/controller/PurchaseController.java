package com.steam.payment.controller;

import com.steam.payment.dto.PurchaseGamesRequest;
import com.steam.payment.global.common.Body;
import com.steam.payment.global.common.JsonProperties;
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
    private final JsonProperties jsonProperties;

    @PostMapping("/cart/purchase")
    @ResponseBody
    public ResponseEntity<Body<Object>> purchase(@Valid @RequestBody PurchaseGamesRequest request) {
        return ResponseEntity.ok(
                Body.success(purchaseService.purchaseGames(request))
        );
    }

    @GetMapping("/jsontest")
    @ResponseBody
    public ResponseEntity<Body<Object>> test() {
        return ResponseEntity.ok(
                Body.success(jsonProperties)
        );
    }
}
