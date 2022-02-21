# Backend
### 팀원 소개
- 장성현
  - 기술스택
    - GO
    - gRPC
  - 설명 문서
    - [리뷰 문서](https://github.com/STOVE-Milk/steam-clone/blob/develop/docs/BE_Go_code_description_JSH.md)
- 한태현
  - 기술 스택
    - Java/Spring
  - 설명 문서
    - [리뷰 문서](https://github.com/STOVE-Milk/steam-clone/blob/develop/docs/BE_Spring_code_description_HTH.md)
- 민지호
  - 기술 스택
    - NodeJs
  - 설명 문서
    - [리뷰 문서](https://github.com/STOVE-Milk/steam-clone/blob/develop/docs/FE_React_BE_NodeJS_code_description_MJH.md)


### 서버 종류 & 역할 분담
|서버명|담당자|포트 번호|url prefix|폴더명|배포 방법|
|:---:|:---:|:---:|:---:|:---:|:---:|
|Api Gateway|한태현|8080|/|api-gateway|PM2|
|인증|민지호|8081|/auth|auth|PM2|
|gRPC Gateway|장성현|8100|/store|gRPC-gateway|Docker|
|상점|장성현|8101|/store|store|Docker|
|채팅 로드 밸런서|장성현|8102|/chat|chat-lb|Docker|
|채팅|장성현|8111~8113|/chat|chat|Docker|
|결제|한태현|8200|/payment|payment|PM2|
|멤버십|한태현|8201|/membership|membership|PM2|
|라이브러리-마이 룸|한태현|8210~8213|/library|library|PM2|
|서비스 디스커버리|한태현|8761|/eureka|discovery|PM2|

### Infra 정보
|이름|담당자|포트 번호|실행 방법|
|:---:|:---:|:---:|:---:|
|MySQL|전체|3306|Docker|
|Redis|전체|6379, 6380|Docker|
|MongoDB|전체|27017|Docker|
|Image Server|한태현|80|NginX|
|RabbitMQ|한태현|15672|Daemon|


### DB 종류 & 사용 용도
- MySQL
  - 영구적이고 안전하게 보관되어야 할 서비스에 필요한 전반적인 데이터를 저장하는 용도로 사용
  - [DB Schema Link]()
  - 사용 서버
    - 서버 전체
- Redis
  - 임시적인 데이터 저장, 조회 데이터 캐싱에 사용
  - 채팅 Pub/Sub에 사용
  - 사용 서버
    - 인증: 인증 시 토큰 저장
    - 결제: 카카오페이 API 임시 데이터
    - 채팅: Pub/Sub
- MongoDB
  - 로그 저장 용도 및 수정이 잦은 데이터 저장에 사용
  - 사용 서버
    - 결제: 충전/결제 로그
    - 채팅: 채팅 로그, 채팅방/유저 정보 저장

### 디렉토리 구조
```
backend
├── api-gateway
├── auth
├── chat
├── chat-lb
├── discovery
├── gRPC-gateway
├── library
├── membership
├── payment
└── store
```

### 협업
- API 공유 문서
    - [API 문서](https://github.com/STOVE-Milk/steam-clone/files/8103452/API.xlsx)

- ERD 수정 기록
    - [ERD 수정](https://github.com/STOVE-Milk/steam-clone/wiki/%5BMilk%5D-ERD-%EC%88%98%EC%A0%95-%EB%AC%B8%EC%84%9C)

### 배포
- 개인 홈 서버를 구성하여 사용
  - Ubuntu 20.04 LTS
- 기본 DNS
  - fortice.iptime.org
- 추가 DNS
  - fortice.co.kr