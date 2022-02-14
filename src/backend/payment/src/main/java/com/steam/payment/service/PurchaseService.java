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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class PurchaseService {
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;
    private final AccountRepository accountRepository;
    private final LoggingService loggingService;

    /*
        Purchase 서비스에서 메소드의 내부
        자체 메소드를 호출하는 경우 @Transactional이 적용되지 않는 문제가 발생했습니다.
        @Transactional이 트랜잭션 처리를 하는 방식을 공부하고, 이에 따라 Self Injection 방식을 적용했습니다.

        이후 DI 루프가 발생해서 구매 로직을 합치고 롤백되면 안되는 로깅 서비스를 따로 분리하여서
        propagation.NOT_SUPPORTED 옵션을 통해 롤백되지 않도록 처리했습니다.

        참고했던 블로그:
            https://kapentaz.github.io/spring/Spring-Transaction-%EC%A0%81%EC%9A%A9-%EB%B2%94%EC%9C%84-%EC%A0%9C%EC%96%B4-%EB%B0%A9%EB%B2%95/#
            https://gmoon92.github.io/spring/aop/2019/04/01/spring-aop-mechanism-with-self-invocation.html
    */
    //private final PurchaseService self;

    @Transactional
    public List<GameDto> purchaseGames(PurchaseGamesRequest request) {
        String userCountry = UserContext.getUserCountry();
        /*
            게임 가격은 여러 나라에서 퍼블리싱할 상황을 대비하여 DOUBLE 형으로 만들었습니다.
            DB에는 JSON 형태로 저장하여 "국가코드":가격 형태로 저장하게 됩니다.
        */
        List<GameDto> games = gameRepository.findAllById(request.getGamesId()).stream()
                .map(game -> GameDto.of(game, userCountry))
                .collect(Collectors.toList());
        Double totalPrice = games.stream()
                .mapToDouble(GameDto::getSalePrice)
                .sum();
        User user = userRepository.findById(UserContext.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Validator.validGamePrice(games, request.getGames());
        Validator.validUserMoney(user, totalPrice);
        // Validator 클래스로 따로 분리하지는 못했지만, 이미 소유하고 있는 게임인지 확인합니다.
        List<Integer> gameIds = games.stream()
                .map(GameDto::getId)
                .collect(Collectors.toList());
        List<Library> myLibraries = libraryRepository.findAllByUserAndGameId(user, gameIds);
        if(!myLibraries.isEmpty())
            throw new CustomException(ErrorCode.GAME_ALEADY_PURCHASED);

        loggingService.logPurchaseReady(user, games, totalPrice);

        List<Library> libraries = games.stream()
                .map(game -> game.toLibraryEntity(user))
                .collect(Collectors.toList());
        /*
            개발사의 계좌에 돈을 입금하는 트랜잭션 부분 입니다.
            개발사의 계좌는 여러 유저가 동시에 돈을 입금하게 되는 경우가 발생하여 갱신 분실 문제가 발생할 수 있다고 생각했습니다.
            이를 해결하기 위해 Lock 처리를 따로 적용해주었습니다.
            Lock 처리는 accountRepository의 쿼리 메소드에 적용했습니다.
        */
        for (GameDto game : games) {
            Account account = accountRepository.findByPublisherIdAndCountry(game.getPublisherId(), userCountry).get();
            account.addMoney(game.getSalePrice());
            accountRepository.save(account);
        }
        user.substractMoney(totalPrice);
        libraryRepository.saveAll(libraries);
        userRepository.save(user);

        loggingService.logPurchaseSuccess(user.getIdx(), totalPrice);

        return games;
    }
}
