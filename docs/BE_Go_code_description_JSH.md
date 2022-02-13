# 장성현 코드 리뷰 준비 자료 - team milk 
## 목차
1. [본인 소개](#-1-본인-소개)
2. [프로젝트 소개](#-2-프로젝트-소개)
3. [맡은 작업](#-3-맡은-작업)
4. [디렉토리 구조](#-4-디렉토리-구조)
5. [링크](#-5-링크)

---
## 1. 본인 소개
---
- 이름 : 장성현
- 분야 : 백엔드
- 주 사용 언어 : Go
- 사용 기술
  - MySQL : 상점의 데이터를 관리하기 위해 사용.
  - MongoDB : 채팅 로그 및 동적인 룸 데이터와 유저 데이터를 관리하기 위해 사용
  - Redis : Pub/Sub 패턴을 통해 단일 서버 인스턴스 뿐 아니라 모든 인스턴스와 대화를 할 수 있게하기 위해 사용.
  - WebSocket : 실시간으로 진행, 공유 되어야 하는 채팅, 유저 상태 정보를 관리하기 위해 사용

- 캠프 목표 : 개발에 대한 시야를 넓히고 최대한 많은 경험을 하여 성장의 발판을 만들자.

---
## 2. 프로젝트 소개
---
- 주제 : Steam (스토어) 클론 코딩
- 임한 자세 : 사용자 뿐 아니라 개발자도 즐거운 서비스 개발을 목표로 진행.

---
## 3. 맡은 작업
---
1. 상점 서버 제작.
   1. gRPC를 사용하여 사용자와 통신 진행.
      1. Proto Buffer 사용을 위해 .proto 파일을 통해 객체 생성.
      2. http 통신을 하기 위해 gRPC gateway 제작.
   2. 유저의 jwt 토큰 정보를 사용해 데이터 제공.
   3. controller, server, repository 패턴 사용.
2. 채팅 서버 및 기능 제작.
   1. Redis의 Pub/Sub 패턴을 활용하여 단일 서버 인스턴스 뿐 아니라 모든 인스턴스와 대화를 할 수 있게 제작.
   2. mongoDB를 활용하여 채팅 로그, 채팅 방 정보, 그리고 유저 정보를 관리.
   3. 웹 소켓 서버와 룸, 그리고 클라이언트가 해야할 동작을 나누어 패키지로 관리.
   4. 고루틴을 사용하여 동시성 확보.
   
   채팅 참고 자료) https://www.whichdev.com/go-vuejs-chat/
---
## 4. 디렉토리 구조
---
### store
```json
store
├── config                  // 서버 초기 실행 시 필요한 설정
│   ├── database.go
│   └── errors.go
├── controller
│   └── game.go             // 요청과 응답 처리
├── errors
│   └── errors.go           // 에러파일 관리
├── go.mod                  // 확장 모듈 관리
├── go.sum                  // 확장 모듈 관리
├── google                  // grpc gateway 사용을 위해 가져와야할 proto files
│   └── api
│       ├── annotations.proto
│       └── http.proto
├── main.go                 // app 실행
├── models                  // 코드 내부에서 사용할 객체
│   ├── errors.go
│   ├── game.go
│   └── token.go
├── proto                   // grpc를 사용하기 위한 protocol buffer 작성
│   ├── store.pb.go
│   ├── store.proto
│   └── store_grpc.pb.go
├── repository              // MySQL CRUD 작업을 위한 repository 
│   └── repository.go       
├── server.go               // 서버 설정과 실행
├── service    
│   └── game.go             // 요청에 대한 로직 처리                  
├── token       
│   └── token.go            // token의 metadata를 추출하기 위한 파일
└── utils                        
    └── utils.go            // 프로젝트 전체적으로 사용할 함수.
```

### chat
```json
chat
├── chatServer.go             // 웹 소캣 서버가 맡은 동작을 관리 
├── client.go                 // 클라이언트가 맡은 동작을 관리
├── config                    // 웹 소캣 서버 초기 실행 시 필요한 설정
│   ├── database.go
│   ├── mongo.go
│   └── redis.go
├── go.mod
├── go.sum
├── main.go                   // 웹 소캣 서버 초기 설정 및 실행
├── message.go                // 프론트와 채팅 시 사용할 메세지 관리.
├── models                    // 코드 내부에서 사용할 객체
│   ├── room.go
│   ├── token.go
│   └── user.go
├── repository                // MySQL CRUD 작업을 위한 repository
│   ├── roomMongoRepository.go
│   ├── userMongoRepository.go
│   └── userRepository.go
└── room.go                   // 룸이 맡은 동작을 관리
```

---
## 5. 링크
---
- [gRPC gateway](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/gRPC-gateway)
- [store](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/store)
  - [models](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/store/models)
  - [controller](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/store/controller)
  - [service](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/store/service)
  - [repository](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/store/repository)
- [chat](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/chat)
  - [models](https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/chat/models)
  - [WebSocketServer](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/chat/chatServer.go)
  - [Room](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/chat/room.go)
  - [Client](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/chat/client.go)
