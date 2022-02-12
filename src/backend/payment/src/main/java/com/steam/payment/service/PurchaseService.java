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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

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

    /*
        Purchase 서비스에서 메소드의 내부
        자체 메소드를 호출하는 경우 @Transactional이 적용되지 않는 문제가 발생했습니다.
        @Transactional이 트랜잭션 처리를 하는 방식을 공부하고, 이에 따라 Self Injection 방식을 적용했습니다.

        참고했던 블로그: https://kapentaz.github.io/spring/Spring-Transaction-%EC%A0%81%EC%9A%A9-%EB%B2%94%EC%9C%84-%EC%A0%9C%EC%96%B4-%EB%B0%A9%EB%B2%95/#
    */
    private final PurchaseService self;

    public Object purchaseGames(PurchaseGamesRequest request) {
        String userCountry = UserContext.getUserCountry();
        /*
            게임 가격은 여러 나라에서 퍼블리싱할 상황을 대비하여 DOUBLE 형으로 만들었습니다.
            DB에는 JSON 형태로 저장하여 "국가코드":가격 형태로 저장하게 됩니다.
        */
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
        /*
            Validator 클래스로 따로 분리하지는 못했지만, 이미 소유하고 있는 게임인지 확인합니다.
        */
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

        self.purchase(user, gameDatas, totalPrice, userCountry);

        purchaseLogDocument.getLastPurchaseLog().success(totalPrice);
        purchaseLogDocumentRepository.save(purchaseLogDocument);

        return gameDatas;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void purchase(User user, List<GameDto> games, Double totalPrice, String userCountry) {
        List<Library> libraries = games.stream()
                .map(game -> game.toLibraryEntity(user))
                .collect(Collectors.toList());
        /*
            개발사의 계좌에 돈을 입금하는 트랜잭션 부분 입니다.
            개발사의 계좌는 여러 유저가 동시에 돈을 입금하게 되는 경우가 발생하여 갱신 분실 문제가 발생할 수 있다고 생각했습니다.
            이를 해결하기 위해 Lock 처리를 따로 적용해주었습니다.
            Lock 처리는 Repository의 쿼리에 적용했습니다.
        */
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
