package com.steam.payment.service;

import com.steam.payment.dto.GameDto;
import com.steam.payment.dto.PurchaseGamesRequest;
import com.steam.payment.entity.Game;
import com.steam.payment.entity.Library;
import com.steam.payment.entity.PurchaseLog;
import com.steam.payment.entity.User;
import com.steam.payment.global.common.UserContext;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;
import com.steam.payment.global.util.Validator;
import com.steam.payment.repository.GameRepository;
import com.steam.payment.repository.LibraryRepository;
import com.steam.payment.repository.PurchaseLogRepository;
import com.steam.payment.repository.UserRepository;
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
    private final PurchaseLogRepository purchaseLogRepository;

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

        purchase(user, gameDatas, totalPrice);
        //TODO: LOGGING PURCHASE LOG
        //logPurchase()

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

    private void logPurchase(User user, List<GameDto> games) {
        List<PurchaseLog> logs = games.stream()
                        .map(game -> PurchaseLog.builder()
                                .userId(user.getIdx())
                                .gameId(game.getIdx())
                                .price(game.getPrice())
                                .sale(game.getSale())
                                .country(user.getCountry())
                                .build()
                        ).collect(Collectors.toList());
        purchaseLogRepository.saveAll(logs);
    }
}
