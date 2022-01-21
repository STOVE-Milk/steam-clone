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

    public Object purchaseGames(PurchaseGamesRequest request) {
        String userCountry = UserContext.getUserCountry();
        List<GameDto> gameDatas = gameRepository.findAllById(request.getGamesId()).stream()
                .map(game -> GameDto.of(game, userCountry))
                .collect(Collectors.toList());
        Double totalPrice = gameDatas.stream()
                .mapToDouble(GameDto::getSalePrice)
                .sum();
        User user = userRepository.findById(UserContext.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Validator.validGamePrice(gameDatas, request.getGames());
        Validator.validUserMoney(user, totalPrice);

        List<Account> publisherAccounts = new ArrayList<>();
        for(GameDto game : gameDatas) {
            Account account = accountRepository.findByPublisherIdAndCountry(game.getPublisherId(), userCountry)
                    .orElseGet(() -> Account.builder()
                            .publisherId(game.getPublisherId())
                            .money(0.0)
                            .country(userCountry)
                            .isValid(false)
                            .build()
                    );

            publisherAccounts.add(account);
        }

        PurchaseLogDocument purchaseLogDocument = purchaseLogDocumentRepository.findById(user.getIdx().toString())
                        .orElseGet(() -> PurchaseLogDocument.newUser(user.getIdx()));
        purchaseLogDocument.getPurchaseLogs().add(PurchaseLog.of(user, gameDatas, totalPrice));
        purchaseLogDocumentRepository.save(purchaseLogDocument);

        purchase(user, publisherAccounts, gameDatas, totalPrice);

        purchaseLogDocument.getLastPurchaseLog().success(user.getMoney());
        purchaseLogDocumentRepository.save(purchaseLogDocument);

        return gameDatas;
    }

    @Transactional
    protected void purchase(User user, List<Account> publisherAccounts, List<GameDto> games, Double totalPrice) {
        List<Library> libraries = games.stream()
                .map(game -> game.toLibraryEntity(user))
                .collect(Collectors.toList());
        for(int i = 0; i < games.size(); i++)
            publisherAccounts.get(i).addMoney(games.get(i));
        user.substractMoney(totalPrice);
        try {
            libraryRepository.saveAll(libraries);
        } catch (DataIntegrityViolationException e) {
            throw new CustomException(ErrorCode.GAME_ALEADY_PURCHASED);
        }
        accountRepository.saveAll(publisherAccounts);
        userRepository.save(user);
    }
}
