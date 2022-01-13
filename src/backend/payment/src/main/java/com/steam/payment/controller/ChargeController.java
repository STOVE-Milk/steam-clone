package com.steam.payment.controller;

import com.steam.payment.dto.ChargeApproveRequest;
import com.steam.payment.dto.ChargeReadyRequest;
import com.steam.payment.global.common.Body;
import com.steam.payment.service.ChargeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/payment")
public class ChargeController {
    private final ChargeService chargeService;

    @GetMapping("/giftcards/{nation}")
    @ResponseBody
    public ResponseEntity<Body<Object>> getGiftcardList(@PathVariable("nation") String nation) {
        return ResponseEntity.ok(
                Body.success(chargeService.getGiftcardList(nation))
        );
    }

    @PostMapping("/charge/ready")
    @ResponseBody
    public ResponseEntity<Object> chargeReady(@RequestBody ChargeReadyRequest request) {

        return ResponseEntity.ok(
                chargeService.chargeReady(request)
                //Body.getSuccessBody("test")
        );
    }

    @PostMapping("/charge/approve")
    @ResponseBody
    public ResponseEntity<Object> chargeApprove(@RequestBody ChargeApproveRequest request) {

        return ResponseEntity.ok(
                chargeService.chargeApprove(request)
        );
    }
}
