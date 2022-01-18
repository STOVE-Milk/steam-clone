package com.steam.payment.repository.mongodb;

import com.steam.payment.entity.mongodb.PurchaseLogDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseLogDocumentRepository extends MongoRepository<PurchaseLogDocument, String> {
}
