package com.steam.payment.service;

import com.steam.payment.dto.GameDto;
import com.steam.payment.dto.PurchaseGamesRequest;
import com.steam.payment.entity.Library;
import com.steam.payment.entity.User;
import com.steam.payment.entity.mongodb.PurchaseLog;
import com.steam.payment.entity.mongodb.PurchaseLogDocument;
import com.steam.payment.global.common.UserContext;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;
import com.steam.payment.global.util.Validator;
import com.steam.payment.repository.GameRepository;
import com.steam.payment.repository.LibraryRepository;
import com.steam.payment.repository.UserRepository;
import com.steam.payment.repository.mongodb.PurchaseLogDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PurchaseService {
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
    private final PurchaseLogDocumentRepository purchaseLogDocumentRepository;

    public Object purchaseGames(PurchaseGamesRequest request) {
        List<GameDto> gameDatas = gameRepository.findAllById(request.getGamesId()).stream()
                .map(game -> GameDto.of(game, "KR"))
                .collect(Collectors.toList());
        Double totalPrice = gameDatas.stream()
                .mapToDouble(GameDto::getSalePrice)
                .sum();
        User user = userRepository.findById(UserContext.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Validator.validGamePrice(gameDatas, request.getGames());
        Validator.validUserMoney(user, totalPrice);

        PurchaseLogDocument purchaseLogDocument = purchaseLogDocumentRepository.findById(user.getIdx().toString())
                        .orElseGet(() -> PurchaseLogDocument.newUser(user.getIdx()));
        purchaseLogDocument.getPurchaseLogs().add(PurchaseLog.of(user, gameDatas, totalPrice));
        purchaseLogDocumentRepository.save(purchaseLogDocument);

        purchase(user, gameDatas, totalPrice);

        purchaseLogDocument.getLastPurchaseLog().success(user.getMoney());
        purchaseLogDocumentRepository.save(purchaseLogDocument);

        return gameDatas;
    }

    @Transactional
    protected void purchase(User user, List<GameDto> games, Double totalPrice) {
        List<Library> libraries = games.stream()
                .map(game -> game.toLibraryEntity(user))
                .collect(Collectors.toList());
        user.substractMoney(totalPrice);
        try {
            libraryRepository.saveAll(libraries);
        } catch (DataIntegrityViolationException e) {
            throw new CustomException(ErrorCode.GAME_ALEADY_PURCHASED);
        }
        userRepository.save(user);
    }
}
