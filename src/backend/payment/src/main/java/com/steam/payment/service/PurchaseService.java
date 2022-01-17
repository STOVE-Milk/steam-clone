package com.steam.payment.service;

import com.steam.payment.dto.GameDto;
import com.steam.payment.dto.PurchaseGamesRequest;
import com.steam.payment.entity.Game;
import com.steam.payment.entity.Library;
import com.steam.payment.entity.User;
import com.steam.payment.global.common.UserContext;
import com.steam.payment.global.error.CustomException;
import com.steam.payment.global.error.ErrorCode;
import com.steam.payment.global.util.Validator;
import com.steam.payment.repository.GameRepository;
import com.steam.payment.repository.LibraryRepository;
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

    public Object purchaseGames(PurchaseGamesRequest request) {
        List<GameDto> gameDatas = getGameDatasById(request.getGamesId());
        Double totalPrice = gameDatas.stream()
                .mapToDouble(GameDto::getSalePrice)
                .sum();
        User user = getUserDataById(UserContext.getUserId());

        Validator.validGamePrice(gameDatas, request.getGames());
        Validator.validUserMoney(user, totalPrice);

        purchase(user, gameDatas, totalPrice);
        //TODO: LOGGING PURCHASE LOG
        return gameDatas;
    }

    private List<GameDto> getGameDatasById(List<Integer> ids) {
        return gameRepository.findAllById(ids).stream()
                .map(game -> GameDto.of(game, "KR"))
                .collect(Collectors.toList());
    }

    private User getUserDataById(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional
    protected void purchase(User user, List<GameDto> gameData, Double totalPrice) {
        List<Library> libraries = gameData.stream()
                .map(g -> g.toLibraryEntity(user))
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
