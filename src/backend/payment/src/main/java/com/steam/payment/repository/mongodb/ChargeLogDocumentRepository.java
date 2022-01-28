package com.steam.payment.repository.mongodb;

import com.steam.payment.entity.mongodb.ChargeLogDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChargeLogDocumentRepository extends MongoRepository<ChargeLogDocument, String> {

}
