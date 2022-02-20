# 목차
- 개발자 설명
- 개발한 서버, 기능 설명
- 디렉토리 구조
- 코드 설명
# 개발자 설명
- 이름
  - 한태현
- 분야
  - 백엔드
- 사용 기술
  - Spring Boot - 백엔드 개발을 모두 Spring Boot로 진행
  - MySQL - 서비스에 필요한 데이터 저장 용도
  - MongoDB - 충전/결제 시 로그를 남기는 용도
  - REDIS - 서비스 중 캐싱, 서버 간 데이터 동기화 용도로 사용
  - WebSocket - 유저들의 이동, 방 입장, 퇴장 등 빠른 실시간 통신 용도
# 개발한 서버 종류 및 기능
  - 충전, 결제 서버 (payment)
    - 카카오페이 API를 이용한 충전 기능
    - 충전금을 이용한 게임 구매 기능
  - 게임 라이브러리-로비 서버 (library)
    - 게임 라이브러리를 게더타운을 참고해 소통할 수 있는 공간으로 만들고, 해당 공간을 내가 소유한 게임으로 꾸밀 수 있는 공간을 만들고 싶었습니다.
    - 해당 공간에 입장, 이동, 퇴장, 게임 오브젝트 설치가 가능합니다.
    - 빠른 응답이 필요하다 판단하여 순수 웹소켓을 이용해 구현했습니다.
    - 빠른 응답에 초점을 맞춰 서버간 메세지 전파를 위해 RabbitMQ를 이용했습니다.
  - 멤버십 서버 (membership)
    - 친구 관련 기능
    - 유저 프로필, 방명록 관련 기능
    - 유저 검색 기능
  - API Gateway
    - Spring Cloud Gateway를 이용하여 구현
    - JWT 검증을 통한 인가 기능
  - 서비스 디스커버리
    - Spring Cloud Netflix Eureka를 이용하여 구현
    - 로드 밸런싱, 여러 엔드포인트의 쉬운 식별을 위해 구현했습니다.
# 디렉토리 구조 
- [백엔드 깃 링크](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend)
  
``` sql
+---payment # 충전, 결제 서버
|   \---src.main.java.com.steam
|       \---payment
|           +---dto
|           |   \---kakaopay # 카카오페이 API 호출을 위한 DTO 폴더
|           |
|           +---entity
|           |   |   Account.java # 개발사의 계좌 Entity
|           |   |   Giftcard.java # 충전에 사용할 상품권 Entity
|           |   |   Library.java # 유저가 소유하고 있는 게임 Entity
|           |   |
|           |   +---mongodb # MongoDB를 결제, 충전에 대한 로그를 남기는 용도로 사용
|           |   \---redis # 충전 과정에서 카카오페이 API를 사용하면서 관련 데이터를 임시 저장용으로 사용
|           |
|           +---global
|           |   +---common
|           |   |       Body.java # ResponseEntity의 ResponseBody를 공통적으로 처리하기 위한 객체 (code, message, data)
|           |   |       UserContext.java # Spring Security를 쓰지 않고 ThreadLocal에 유저 데이터(UserDetails)를 저장하기 위한 클래스
|           |   |       UserDetails.java # JWT Payload의 유저 정보를 담을 객체
|           |   |
|           |   +---error
|           |   |       ErrorCode.java # 에러 상황에 따른 코드와 메세지를 담은 Enum 객체
|           |   |       CustomExceptionHandler # ErroCode에 따른 에러 처리를 통합적으로 하기 위한 ExceptionHandler
|           |   |
|           |   +---filter
|           |   |       JwtFilter.java # UserContext에 JWT를 해석해 담는 과정을 Spring Filter로 구현
|           |   |
|           |   \---util
|           |           Validator.java # 게임 구매 시 결제 관련 검증 로직을 구현한 클래스
|           |
|           \---service
|                   ChargeService.java # 충전 서비스 
|                   KakaoPay.java # 충전 서비스에서 사용할 카카오페이 API 서비스
|                   PurchaseService.java # 결제(게임 구매) 서비스
|                       
|                       # 결제 방식 
|                         1. 사용자가 카카오페이를 이용해 상품권을 결제하여 돈을 충전합니다.
|                         2. 충전금을 가지고 게임을 구매합니다.
|
|
+---library # 웹소켓을 이용한 로비 서버, WebSockt + RabbitMQ로 구현
|   \---src.main.java.com.steam
|       \---library
|           |   LibraryWebSocketHandler.java # 웹소켓 핸들러, 메세지 해석, 행위별로 서비스 라우팅
|           |
|           +---dto
|           |   |   MapDto.java # 맵 정보를 담을 DTO
|           |   |   ObjectDto.java # 맵에 설치할 오브젝트(게임)DTO
|           |   |   Room.java # 사용자별 하나의 공간인 Room DTO
|           |   |   UserDto.java # 맵에서 유저 위치 정보를 담고 있는 DTO
|           |   |
|           |   \---messages
|           |           # **RequestMessage : 사용자 행위에 따라 받은 메세지 객체
|           |           # **UserMessage : 사용자 행위에 따라 동기화를 위해 전파할 메세지 객체
|           |
|           +---entity
|           |       RoomCache.java # Room 정보 Redis에 캐싱 (입장 시 빠른 동기화를 위해)
|           |
|           +---global
|           |   +---common
|           |           Behavior.java # 웹 소켓 메세지별 행위 ENUM
|           |           Direction.java # 이동 행위에 따른 방향 ENUM
|           |
|           \---service
|                   PublishService.java # 메세지를 메세지 큐(RabbitMQ)로 발행하는 서비스
|                   SocketDataService.java # 로직에 따라 Redis, MySQL 트랜잭션을 처리하는 서비스
|                   SocketService.java # 웹소켓으로 연결된 세션과 데이터를 직접적으로 다루는 비즈니스 로직 서비스 + 메세지 큐의 데이터 소비
+---membership # 친구, 유저 프로필 관련 서버
|   \---src.main.java.com.steam
|      \---membership
|          \---service
|                  SearchService.java # 검색 서비스 (유저 검색_SQL 쿼리 이용_UserRepository.java)
|                  FriendService.java # 친구 관련 서비스 (친구 CRUD)
|                  ProfileService.java # 프로필 관련 서비스 (프로필, 방명록)
|
+---api-gateway # 인가, 라우팅 담당
|   \---src.main.java.com.steam
|       \---gateway
|           |   JwtValidator.java # JWT 유효성 검증 로직
|           |
|           \---filter
|                   AuthorizationCheckFilter.java # JWT 유효성 검증 필터
| 
+---discovery # 서비스 디스커버리 Spring Cloud Netflix Eureka 
              # 엔드포인트들이 등록하여 엔드포인트를 식별하고, 로드밸런싱 + API Gateway에서 등록된 정보를 통해 라우팅
```

# 아래 코드를 봐주세요
- 결제 서버
  - [결제 서버 깃 링크](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/payment)
  - ThreadLocal을 이용한 쓰레드 내의 유저 정보 저장
    - [ThreadLocal을 담고있는 클래스 UserContext](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/global/common/UserContext.java)
    - [유저 정보를 담은 클래스 UserDetail](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/global/common/UserDetails.java)
    - [서버에서 Access Token을 해석해 UserContext에 저장하는 Filter](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/global/filter/JwtFilter.java)
  - 충전 구현
    - [충전 서비스](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/service/ChargeService.java)
    - [충전에서 사용하는 카카오페이 API 전용 서비스](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/service/KakaoPay.java)
    - [충전에 대한 로그](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/entity/mongodb/ChargeLog.java)
    - [충전 로그를 담은 MongoDB Document](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/entity/mongodb/ChargeLogDocument.java)
  - 결제 구현
    - [결제 서비스](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/service/PurchaseService.java)
    - [결제 내부에서 사용하는 검증전용 클래스](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/global/util/Validator.java)
    - [결제 시 개발사 계좌 Lock 설정을 진행한 Repository](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/repository/AccountRepository.java)
    - [결제에 대한 로그](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/entity/mongodb/PurchaseLog.java)
    - [결제 로그를 담은 MongoDB Document](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/payment/src/main/java/com/steam/payment/entity/mongodb/PurchaseLogDocument.java)
- 라이브러리-로비 서버
  - [로비 서버 깃 링크](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/library)
  - 자체 메세지 규약
    - [행위](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/library/src/main/java/com/steam/library/global/common/Behavior.java)
    - [메세지 디렉토리](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/library/src/main/java/com/steam/library/dto/messages)
  - 소켓 핸들러
    - [핸들러 클래스](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/library/src/main/java/com/steam/library/LibraryWebSocketHandler.java)
  - 비즈니스 로직(서비스)
    - [소켓의 메세지에 따라 세부 로직을 수행하는 클래스, 메세지 큐의 메세지를 소비하는 클래스](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/library/src/main/java/com/steam/library/service/SocketService.java)
    - [트랜잭션 로직들을 처리하는 클래스](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/library/src/main/java/com/steam/library/service/SocketDataService.java)
    - [메세지를 다른 서버에 발행하는 클래스](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/library/src/main/java/com/steam/library/service/PublishService.java)
- 멤버십 서버
  - [멤버십 서버 깃 링크](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/membership)
  - 친구
    - [친구 관련 서비스](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/membership/src/main/java/com/steam/membership/service/FriendService.java)
    - 친구 신청
      - 친구는 신청-수락/거절 과정을 거치기 때문에, FriendRequest 라는 이름으로 친구 신청 상태를 나타냈습니다.
  - 프로필 관련
    - [프로필, 방명록 서비스](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/membership/src/main/java/com/steam/membership/service/ProfileService.java)
  - 검색
    - [검색 서비스(유저 검색)](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/membership/src/main/java/com/steam/membership/service/SearchService.java)
    - [검색 관련 Repository, Query](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/membership/src/main/java/com/steam/membership/repository/UserRepository.java)
- API Gateway
  - [API Gateway 깃 링크](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/api-gateway)
  - API Gateway는 Spring Cloud Gateway를 이용해 구현했습니다.
    - [JWT 검증 클래스](https://github.com/STOVE-Milk/steam-clone/blob/feature/back-api-gateway/src/backend/api-gateway/src/main/java/com/steam/gateway/JwtValidator.java)
    - [JWT 검증 필터](https://github.com/STOVE-Milk/steam-clone/blob/feature/back-api-gateway/src/backend/api-gateway/src/main/java/com/steam/gateway/filter/AuthorizationCheckFilter.java)
