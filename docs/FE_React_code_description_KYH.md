# 최종 코드리뷰 자료 (MILK팀 프론트엔드 개발담당: 김양하)

#### 들어가기 전 ...

MD파일을 예쁘게 보기 위해, 하단 이미지를 참고하여 "Display the rendered blob" 옵션을 클릭해주세요. 🙂
![](https://i.imgur.com/ocWKc5n.png)

</br>

## 목차

1. [프로젝트 소개](#1-프로젝트-소개)
2. [디렉토리 구조](#2-디렉토리-구조)
3. [페이지 소개](#3-페이지-소개)
4. [코드 주석 컨벤션](#4-코드-주석-컨벤션)

</br></br>

## 1. 프로젝트 소개

- **주제**: STEAM(스토어) 클론 프로젝트
- **프론트엔드 기술 스택**: [NextJS](https://nextjs.org/)(ReactJS기반 SSR 프레임워크), Redux, Saga, TypeScript, Styled-component
- **맡은 기능**:
  - [HTTP통신] 카테고리, 회원가입, 로그인, 찜, 카트, 충전
  - [WebSocket통신] 라이브러리(2d)

![](https://i.imgur.com/VKceTwA.png)

</br></br>

## 2. 디렉토리 구조

- **디자인 패턴**: Atomic 구조 사용
  - 협업을 위해 atoms, molecules, organisms의 개념을 정의하고 재사용에 용이한 컴포넌트를 제작했습니다.
- **페이지 라우팅**:
  - NextJS의 프레임워크 사용원칙에 따라 `pages` 디렉토리 내 파일을 만들면 자동으로 라우팅 되는 방식을 사용했습니다.

```
📦components // 재사용 가능한 컴포넌트
 ┣ 📂atoms // 기본적으로 HTML 태그 하나로 구성되는 기본이 되는 컴포넌트
 ┃ ┣ 📜CheckBox.tsx
 ┃ ┣ 📜DefaultButton.tsx
 ┃ ┣ 📜FilledButton.tsx
 ┃ ┣ 📜Profile.tsx
 ┃ ┣ 📜SelectBox.tsx
 ┃ ┗ 📜Text.tsx
 ┣ 📂molecules // atom을 합쳐서 컴포넌트로 사용하는 경우의 컴포넌트
 ┃ ┣ 📜AuthInput.tsx
 ┃ ┣ 📜AuthSelectBox.tsx
 ┃ ┣ 📜CategoryList.tsx
 ┃ ┗ 📜SearchBox.tsx
 ┗ 📂organisms // 가장 큰 단위의 재사용 컴포넌트 통신코드가 들어가는 경우도 있음.
 ┃ ┣ 📜GameInfo.tsx
 ┃ ┣ 📜Header.tsx

 📦pages // 페이지
 ┣ 📜_app.tsx
 ┣ 📜_document.tsx
 ┣ 📜cart.tsx
 ┣ 📜category.tsx
 ┣ 📜signin.tsx
 ┣ 📜signup.tsx
 ┗ 📜wishlist.tsx
```

</br></br>

## 3. 페이지 소개

### 1. 카테고리 페이지

: 카테고리와 해당하는 게임들을 해당하는 게임들을 서버에서 불러와서 보여주는 페이지

- **구현 중점 포인트**: `반응형처리(Media Query)` `첫 HTTP통신 성공`
- [페이지](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/pages/category.tsx): `pages/category.tsx`
- [중심 컴포넌트](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/components/organisms/GameInfo.tsx): `/organisms/GameInfo.tsx`

| Desktop 뷰                           |
| ------------------------------------ |
| ![](https://i.imgur.com/5C5U1rc.png) |

| Tablet 뷰                            | Mobile 뷰                            |
| ------------------------------------ | ------------------------------------ |
| ![](https://i.imgur.com/Mxe95dv.png) | ![](https://i.imgur.com/YfqrSoM.png) |

    * 현재 DB에 dummy data가 담겨있는 관계로 이미지가 동일합니다.

</br>
</br>

### 2. 회원가입/로그인

: 회원가입/로그인으로 나온 정보(JWT)를 Localstorage로 관리하고 전체 Authorization이 필요한 페이지들에게 영상을 미치는 시작 포인트가 되는 페이지 입니다.

- **구현 중점 포인트**: `#setState Hooks를 사용한 setErrors 객체로 회원가입 페이지의 모든 에러 처리`
- [회원가입 페이지](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/pages/signup.tsx): `pages/signup.tsx`
- [로그인 페이지](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/pages/signin.tsx): `pages/signin.tsx`
- [중심 컴포넌트](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/components/molecules/AuthInput.tsx): `/molecules/AuthInput.tsx`

| 회원가입(Signup)                     | 로그인(Signin)                       |
| ------------------------------------ | ------------------------------------ |
| ![](https://i.imgur.com/YD0uWpw.png) | ![](https://i.imgur.com/BOjJtTO.png) |

</br>
</br>

### 3. 찜/장바구니, 결제

:카테고리 페이지등 게임 정보가 있는 페이지에서 찜/장바구니 버튼을 눌렀을 때 찜은 `/wishlist`로 장바구니는 `/cart`로 이동

- **구현 중점 포인트**: `프론트엔드의 Store를 통한 데이터의 상태 관리`
  - 맨 처음 찜 목록은 API 통신을 통해 서버에서 가져오고, 이후에는 프론트엔드 Store에서 관리합니다.
  - 카트 목록은 프론트엔드 Store에서 전적으로 관리하고 페이지를 나갔다 들어오면 초기화됩니다.
- [찜(wishlist) 페이지](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/pages/wishlist.tsx): `pages/wishlist.tsx`
- [장바구니(cart) 페이지](https://github.com/STOVE-Milk/steam-clone/blob/develop/src/frontend/pages/cart.tsx): `pages/cart.tsx`
  - 카카오페이 충전

| 찜(wishlist)                         | 장바구니(cart)                       |
| ------------------------------------ | ------------------------------------ |
| ![](https://i.imgur.com/OLlrGcJ.png) | ![](https://i.imgur.com/pUxq0HH.png) |

</br>
</br>

### 4. 충전(카카오페이 API)

- **구현 중점 포인트**: `카카오페이 API - 결제요청/승인요청 처리`
  - 결제 요청(tid를 store 보관) -> QR 팝업 띄우기 -> 완료(pg_token을 localstorage에 보관) -> 결제 승인 -> 완료 의 프로세스 구현하기
  - tid와 pg_token을 보관하는 방법
- 비동기 처리 이슈로 개발 진행 중 입니다. [Pull Request 바로가기](https://github.com/STOVE-Milk/steam-clone/pull/18)
- [충전 요청 페이지](https://github.com/STOVE-Milk/steam-clone/blob/d6b590931ef77329b4b57cd15dba7f4c50939d13/src/frontend/pages/charge/index.tsx)
- [충전 승인 페이지](https://github.com/STOVE-Milk/steam-clone/blob/d6b590931ef77329b4b57cd15dba7f4c50939d13/src/frontend/pages/charge/approval/finish.tsx)

| 충전 요청 페이지                     |
| ------------------------------------ |
| ![](https://i.imgur.com/Iht4CYW.png) |

</br>
</br>

### 5. 라이브러리

- 사용자가 구매한 게임 중 설치한 게임을 2D 그래픽(react-konva)에서 표현하고, 이 공간에서 WebSocket으로 통신하여 유저들이 함께 공간을 이용할 수 있는 페이지입니다.
- 현재 개발 진행중입니다. [Pull Request 바로가기](https://github.com/STOVE-Milk/steam-clone/pull/63)
- **구현 중점 포인트**: `WebSocket통신` `프론트엔드 2D그래픽 구현, 좌표처리`
  - WebSocket으로 통신을 진행하고, React-Konva를 사용하여 그린 2D 그래픽들의 좌표를 감지하여 서버에게 이 좌표를 보내주는 것

![](https://user-images.githubusercontent.com/48500209/153407366-0e35a690-4f23-4ede-8e36-44d82c547eda.gif)

</br>
</br>
 
###  4. 코드 주석 컨벤션
: 코드 속에서 설명을 위해 추가해놓은 주석에 대한 내용입니다.
```
[refer]: 참고한 코드가 있는 경우
[explain]: 설명이 필요하다고 생각하는 부분
[info]: 협업을 위해 공유되어야 할 내용, 충분히 인지되면 삭제

TO DO: 앞으로 해야할 일

```

```
