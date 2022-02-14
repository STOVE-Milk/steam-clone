# 최종 코드 리뷰 

Milk Frontend 민지호

<br/>
<br/>

## 목차

1. 프로젝트 소개

2. Frontend

   2-1. 담당 개발

   2-2. 디렉토리 구조

   2-3. 페이지 뷰와 내부에서 쓰인 주요 컴포넌트

   2-4. 리덕스 스토어와 사가

3. Backend

   3-1. 담당 개발

   3-2. 디렉토리 구조

   
<br/>
<br/>

## 1. 프로젝트 소개

- **주제**: STEAM 클론 프로젝트

- **기술 스택**
  - Frontend: Next.js, Redux, Redux-Saga, Typescript, Axios, styled-components
  - Backend: NodeJS, Express, MySQL, Sequelize, Redis


<br/>
<br/>



## 2. Frontend

github: https://github.com/STOVE-Milk/steam-clone/tree/develop/src/frontend

<br/>

### 2-1. 담당 개발

- 공통 컴포넌트 개발 (atomic design 패턴 기반)

  - atoms 

    - **Modal**: 모달 컴포넌트
    - **Profile**: 유저 프로필 컴포넌트
    - **Text** (w.양하님): 텍스트 컴포넌트

  - molecules

    - **GameSlide**: carousel에서 element로 쓰일 컴포넌트

  - organisms

    - **Carousel**: carousel 컴포넌트
    - **NavBar**: 화면 좌측에 있는 네비게이션 바

  <br/>  

- 페이지 개발 및 통신

  - **메인 페이지** / 
  - **게임 상세 페이지** /game/:id
  - **친구 페이지** /friend
  - **유저 페이지** /user/:id
  - **채팅 페이지** /chat
  - 각 페이지에서 필요한 API 통신 처리 

  <br/>

- 리덕스와 리덕스 사가 
  - 리덕스 스토어 및 사가 구조 세팅
  - 액션, 리듀서, 사가에서 쓰일 **유틸 함수** 개발

<br/>
<br/>

### 2-2. 디렉토리 구조

```
📦components //재사용 가능한 공통 컴포넌트들과 내부 컴포넌트들
 ┃
 ┣ 📂atoms
 ┃ ┣ 📜Dot.tsx
 ┃ ┣ 📜Modal.tsx
 ┃ ┣ 📜MsgBox.tsx
 ┃ ┣ 📜Profile.tsx
 ┃ ┗ 📜Text.tsx
 ┃
 ┣ 📂molecules
 ┃ ┣ 📜BigGameSlide.tsx
 ┃ ┣ 📜GameSlide.tsx
 ┃ ┣ 📜FriendBox.tsx
 ┃ ┗ 📜MenuBox.tsx
 ┃
 ┗ 📂organisms
   ┣ 📜BigCarousel.tsx
   ┣ 📜Carousel.tsx
   ┣ 📜GameReview.tsx
   ┣ 📜GuestBook.tsx
   ┣ 📜NavBar.tsx
   ┣ 📜SelectCarousel.tsx
   ┗ 📜UserInfo.tsx
   
📦modules //리덕스 스토어와 리덕스 사가 관련 모듈
 ┃
 ┣ 📂api 
 ┃ ┃
 ┃ ┣ 📂friend
 ┃ ┃ ┣ 📜api.ts //서버 api
 ┃ ┃ ┗ 📜type.ts //api에서 주고받을 요청/응답 타입 지정
 ┃ ┃
 ┃ ┣ 📂game
 ┃ ┃ ┣ 📜api.ts 
 ┃ ┃ ┗ 📜type.ts 
 ┃ ┃
 ┃ ┣ 📂guestbook
 ┃ ┃ ┣ 📜api.ts
 ┃ ┃ ┗ 📜type.ts 
 ┃ ┃
 ┃ ┣ 📂review
 ┃ ┃ ┣ 📜api.ts
 ┃ ┃ ┗ 📜type.ts 
 ┃ ┃
 ┃ ┗ 📜axiosClient.ts //api 호출시 사용할 axios의 모듈화
 ┃
 ┣ 📂game //게임 관련 스토어 
 ┃ ┣ 📜actions.ts //액션 
 ┃ ┣ 📜index.ts //모듈 불러오는 곳
 ┃ ┣ 📜initalData.ts //스토어 초기 state 데이터 
 ┃ ┣ 📜reducer.ts //리듀서 
 ┃ ┣ 📜saga.ts //사가 
 ┃ ┗ 📜types.ts //스토어 state들의 타입 지정
 ┃ 
 ┣ 📂utils //스토어와 사가에서 쓰일 유틸 함수들
 ┃ ┣ 📜actionUtils.ts //액션 유틸 함수 - 요청/성공/실패 액션 생성
 ┃ ┣ 📜reducerUtils.ts //리듀서 유틸 함수 - 액션에 따른 state의 상태(로딩/데이터/에러) 생성
 ┃ ┗ 📜sagaUtils.ts //사가 유틸 함수 - 단순한 get요청을 위한 사가 생성
 ┃
 ┣ 📜configureStore.ts //루트 리듀서로 스토어 생성 후 사가 미들웨어 적용
 ┗ 📜index.ts //여러 리듀서 합쳐서 루트 리듀서 생성
 
 📦templates //페이지에서 쓰일 레이아웃을 담아둠 
 ┗ 📜Layout.tsx //NavBar, Header, Content가 담기는 레이아웃
 
 📦pages //페이지
 ┃
 ┣ 📂game 
 ┃ ┗ 📜[id].tsx //게임 상세 페이지
 ┃
 ┣ 📂user
 ┃ ┗ 📜[id].tsx //유저 페이지
 ┃
 ┣ 📜_app.tsx
 ┣ 📜_document.tsx
 ┣ 📜chat.tsx //채팅 페이지
 ┣ 📜friend.tsx //친구 페이지
 ┗ 📜index.tsx //메인 페이지

```

<br/>
<br/>

### 2-3. 페이지와 내부에서 쓰인 주요 컴포넌트

- 메인 페이지 : https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/pages/index.tsx
  - 하나의 carousel 라이브러리를 이용하여 여러가지의 carousel 개발

  - BigCarousel : https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/components/organisms/BigCarousel.tsx

    <img width="1405" alt="스크린샷 2022-02-14 오전 7 41 12" src="https://user-images.githubusercontent.com/24283401/153778453-fb4a5605-1f17-4c5c-89ac-202b70779e6d.png">

  

  - Carousel : https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/components/organisms/Carousel.tsx

    <img width="1419" alt="스크린샷 2022-02-14 오전 8 01 58" src="https://user-images.githubusercontent.com/24283401/153779167-9769f3c6-15c4-4ce2-abfe-93cdd7166c0b.png">

  - NavBar: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/components/organisms/NavBar.tsx
  - window width에 따라 media query를 이용하여 NavBar 반응형 처리 

    <img width="227" alt="스크린샷 2022-02-14 오전 8 19 50" src="https://user-images.githubusercontent.com/24283401/153779745-ba4d7f7c-0218-4aac-8f81-e67790fab241.png">
    <img width="118" alt="스크린샷 2022-02-14 오전 8 20 07" src="https://user-images.githubusercontent.com/24283401/153779752-98102714-06eb-4897-8e3e-53e66c746be7.png">

<br/>

- 채팅 페이지: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/pages/chat.tsx
  - 웹 소켓을 이용한 채팅 

  ![스크린샷 2022-02-11 오전 11 05 29](https://user-images.githubusercontent.com/24283401/153527199-814a4687-9d03-4667-9707-c749148696d4.png)

  

  - JoinChat: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/components/organisms/JoinChat.tsx

    ![스크린샷 2022-02-11 오전 11 05 43](https://user-images.githubusercontent.com/24283401/153527217-02e3ea8c-341f-4757-b913-f6e31582e7ad.png) 

<br/>

- 친구 페이지: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/pages/friend.tsx

  ​	![스크린샷 2022-02-11 오후 5 03 57](https://user-images.githubusercontent.com/24283401/153556462-4d7f8436-91bd-4647-ae55-3e2321fdbb5b.png)

  ![스크린샷 2022-02-11 오후 5 17 46](https://user-images.githubusercontent.com/24283401/153558072-45552dfb-4bf6-4fe4-a5f6-0d477e6e5135.png)
  
  <br/>

- 유저 페이지: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/pages/user/%5Bid%5D.tsx
  <img width="1418" alt="스크린샷 2022-02-14 오전 8 45 19" src="https://user-images.githubusercontent.com/24283401/153780727-2eeded3c-d3b2-4b75-bf68-f560bc77036f.png">

  - GuestBook: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/components/organisms/GuestBook.tsx
  - 로그인 여부에 따른 3가지 상태 처리 (로그인 했을 때 등록된 내 방명록, 방명록 수정, 로그인 했을 때 타인의 방명록)

<br/>

- 게임 상세 페이지 : https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/pages/game/%5Bid%5D.tsx		![스크린샷 2022-01-24 오후 4 10 36](https://user-images.githubusercontent.com/24283401/150737536-cbdd87db-80aa-465a-86f6-3975c8f412c4.png)

  - 하나의 carousel 라이브러리를 이용하여 여러가지의 carousel 개발	

  - SelcectCarousel: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/components/organisms/SelectCarousel.tsx

    ![스크린샷 2022-01-24 오후 4 10 12](https://user-images.githubusercontent.com/24283401/150737489-9f8ff92d-3996-42c3-957a-45c2d090953a.png)

    

  - GameReview: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/components/organisms/GameReview.tsx
  - 로그인 여부에 따른 4가지 상태 처리 (로그인 했을 때 등록되지 않은 내 리뷰, 로그인 했을 때 등록된 내 리뷰, 리뷰 수정, 로그인 했을 때 타인의 리뷰)

    <img width="985" alt="스크린샷 2022-02-14 오전 7 58 10" src="https://user-images.githubusercontent.com/24283401/153779040-b385bee6-5105-44d4-9501-430892469750.png">
<br/>

<br/>
<br/>

### 2-4. 리덕스 스토어와 사가

- 리덕스 스토어 및 사가 구조 세팅: https://github.com/STOVE-Milk/steam-clone/tree/develop/src/frontend/modules

![스크린샷 2022-02-14 오전 8 17 20](https://user-images.githubusercontent.com/24283401/153779648-68bb28cb-5d4c-46f9-8c04-6b47dec597d9.png)

- 액션, 리듀서, 사가에서 쓰일 **유틸 함수** 개발
  - 액션 유틸 함수: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/modules/utils/actionUtils.ts
  - 리듀서 유틸 함수: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/modules/utils/reducerUtils.ts
  - 사가 유틸 함수: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/modules/utils/sagaUtils.ts

<br/>
<br/>



## 3. Backend

github: https://github.com/STOVE-Milk/steam-clone/tree/develop/src/backend/auth

백엔드를 이해하는 프론트엔드 개발자가 되고자, 이번 프로젝트에서 백엔드 인증 서버 개발을 담당하게 되었습니다.

<br/>

### 3-1. 담당 개발

- 인증 서버 

  - accessToken, refreshToken 발급 정책

  - 인증 서버 API 설계: https://docs.google.com/spreadsheets/d/1NmEUcdA1a5VPHRbN1bDj_5DzdJtYtxrzz0wexQFJeCY/edit#gid=425828133

  - 인증 서버 API 개발: https://github.com/STOVE-Milk/steam-clone/blob/develop/src/backend/auth/routes/auth.js

    - 닉네임 중복 확인  /auth/nickname
    - 이메일 중복 확인  /auth/email
    - 회원가입 /auth/signup
    - 로그인 /auth/signin
    - 토큰 재발급 /auth/token
    - 비밀번호 변경 /auth/password
    - 회원 탈퇴 /auth/signout
    - 로그아웃 /auth/logut

  - 에러 코드: https://github.com/STOVE-Milk/steam-clone/tree/feature/common/src/common

    <img width="849" alt="스크린샷 2022-02-14 오전 8 38 37" src="https://user-images.githubusercontent.com/24283401/153780499-4f12c6f3-305e-49e8-a595-185a269a0ecc.png">

<br/>
<br/>

### 3-2. 디렉토리 구조

```
📦auth
 ┃
 ┣ 📂config 
 ┃ ┗ 📜config.json //mysql 설정 파일
 ┃
 ┣ 📂models
 ┃ ┣ 📜index.js //시퀄라이즈 생성 및 모델 초기화
 ┃ ┗ 📜user.js //user table에 들어가는 모델 
 ┃
 ┣ 📂routes
 ┃ ┣ 📜auth.js //인증 서버 API
 ┃ ┗ 📜util.js //API에서 쓰이는 success, fail 처리 유틸 함수
 ┃
 ┣ 📜.env 
 ┣ 📜.gitignore
 ┣ 📜app.js
 ┣ 📜package-lock.json
 ┗ 📜package.json
```

