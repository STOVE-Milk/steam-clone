package com.steam.payment.controller;

import com.steam.payment.dto.ChargeApproveRequest;
import com.steam.payment.dto.ChargeReadyRequest;
import com.steam.payment.global.common.Body;
import com.steam.payment.service.ChargeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;

@RequiredArgsConstructor
@RestController
@RequestMapping("/payment")
public class ChargeController {
    private final ChargeService chargeService;

    @GetMapping("/giftcards/{country}")
    @ResponseBody
    public ResponseEntity<Body<Object>> getGiftcardList(@Valid @NotBlank @PathVariable("country") String country) {
        return ResponseEntity.ok(
                Body.success(chargeService.getGiftcardList(country))
        );
    }

    @PostMapping("/charge/ready")
    @ResponseBody
    public ResponseEntity<Object> chargeReady(@Valid @RequestBody ChargeReadyRequest request) {
        return ResponseEntity.ok(
                Body.success(chargeService.chargeReady(request))
        );
    }

    @PostMapping("/charge/approve")
    @ResponseBody
    public ResponseEntity<Object> chargeApprove(@Valid @RequestBody ChargeApproveRequest request) {
        return ResponseEntity.ok(
                Body.success(chargeService.chargeApprove(request))
        );
    }
}
