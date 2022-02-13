package com.steam.payment.service;

import com.steam.payment.dto.GameDto;
import com.steam.payment.entity.User;
import com.steam.payment.entity.mongodb.PurchaseLog;
import com.steam.payment.entity.mongodb.PurchaseLogDocument;
import com.steam.payment.repository.mongodb.PurchaseLogDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class LoggingService {
    private final PurchaseLogDocumentRepository purchaseLogDocumentRepository;

    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void logPurchaseReady(final User user, List<GameDto> gameDatas, Double totalPrice) {
        PurchaseLogDocument purchaseLogDocument = purchaseLogDocumentRepository.findById(user.getIdx().toString())
                .orElseGet(() -> PurchaseLogDocument.newUser(user.getIdx()));
        purchaseLogDocument.addLog(PurchaseLog.of(user.getMoney(), gameDatas, totalPrice));
        purchaseLogDocumentRepository.save(purchaseLogDocument);
    }

    public void logPurchaseSuccess(Integer userId, Double totalPrice) {
        PurchaseLogDocument purchaseLogDocument = purchaseLogDocumentRepository.findById(userId.toString().toString())
                .orElseGet(() -> PurchaseLogDocument.newUser(userId));
        purchaseLogDocument.getLastPurchaseLog().success(totalPrice);
        purchaseLogDocumentRepository.save(purchaseLogDocument);
    }
}
