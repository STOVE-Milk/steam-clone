package com.steam.payment.repository.mongodb;

import com.steam.payment.entity.mongodb.ChargeLogDoc;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChargeLogDocRepository extends MongoRepository<ChargeLogDoc, String> {

}
