package com.steam.payment.service;

import com.steam.payment.dto.GameDto;
import com.steam.payment.dto.PurchaseGamesRequest;
import com.steam.payment.entity.Account;
import com.steam.payment.entity.Library;
import com.steam.payment.entity.User;
import com.steam.payment.entity.mongodb.PurchaseLog;
import com.steam.payment.entity.mongodb.PurchaseLogDocument;
import com.steam.payment.global.common.UserContext;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;
import com.steam.payment.global.util.Validator;
import com.steam.payment.repository.AccountRepository;
import com.steam.payment.repository.GameRepository;
import com.steam.payment.repository.LibraryRepository;
import com.steam.payment.repository.UserRepository;
import com.steam.payment.repository.mongodb.PurchaseLogDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PurchaseService {
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
    private final AccountRepository accountRepository;
    private final PurchaseLogDocumentRepository purchaseLogDocumentRepository;

    @Transactional
    public Object purchaseGames(PurchaseGamesRequest request) {
        //TODO: 로깅 AOP로 분리
        String userCountry = UserContext.getUserCountry();
        List<GameDto> gameDatas = gameRepository.findAllById(request.getGamesId()).stream()
                .map(game -> GameDto.of(game, userCountry))
                .collect(Collectors.toList());
        Double totalPrice = gameDatas.stream()
                .mapToDouble(GameDto::getSalePrice)
                .sum();
        User user = userRepository.findById(UserContext.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 검증
        Validator.validGamePrice(gameDatas, request.getGames());
        Validator.validUserMoney(user, totalPrice);
        List<Integer> gameIds = gameDatas.stream()
                .map(GameDto::getId)
                .collect(Collectors.toList());
        List<Library> libraries = libraryRepository.findAllById(gameIds);
        if(!libraries.isEmpty())
            throw new CustomException(ErrorCode.GAME_ALEADY_PURCHASED);

        PurchaseLogDocument purchaseLogDocument = purchaseLogDocumentRepository.findById(user.getIdx().toString())
                        .orElseGet(() -> PurchaseLogDocument.newUser(user.getIdx()));
        purchaseLogDocument.addLog(PurchaseLog.of(user.getMoney(), gameDatas, totalPrice));
        purchaseLogDocumentRepository.save(purchaseLogDocument);

        purchase(user, gameDatas, totalPrice, userCountry);

        purchaseLogDocument.getLastPurchaseLog().success(totalPrice);
        purchaseLogDocumentRepository.save(purchaseLogDocument);

        return gameDatas;
    }

    protected void purchase(User user, List<GameDto> games, Double totalPrice, String userCountry) {
        List<Library> libraries = games.stream()
                .map(game -> game.toLibraryEntity(user))
                .collect(Collectors.toList());
        for(GameDto game : games) {
            Account account = accountRepository.findByPublisherIdAndCountry(game.getPublisherId(), userCountry).get();
            account.addMoney(game.getSalePrice());
            accountRepository.save(account);
        }
        user.substractMoney(totalPrice);
        libraryRepository.saveAll(libraries);
        userRepository.save(user);
    }
}
