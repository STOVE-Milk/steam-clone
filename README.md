# Milk 팀 - Steam 클론 프로젝트


## 목차

1. [팀원 소개](#팀원-소개)
   1. 팀원 소개
   2. 역할
2. [프로젝트 소개](#프로젝트-소개)
   1. 프로젝트 진행 기간
   2. 기능
   3. 사용 기술
   4. 아키텍처
   5. 디렉토리 구조
3. [팀 규칙](#팀-규칙)
   1. 그라운드 룰
   2. 깃 규칙
---
# 팀원 소개

|<img src="https://github.com/ummaeha.png" width="300"/>|<img src="https://github.com/minjyo.png" width="300"/>|<img src="https://github.com/abc7468.png" width="300"/>|<img src="https://github.com/Tae-Hyeon.png" width="300"/>| 
|:---:|:---:|:----:|:----:|
|[김양하](https://github.com/ummaeha)|[민지호](https://github.com/minjyo)|[장성현](https://github.com/abc7468)|[한태현](https://github.com/Tae-Hyeon)|
### 역할 분담
- 김양하 - 회원가입/로그인, 카테고리 페이지, 카카오 페이 충전, 결제, 찜, 장바구니, 게임 라이브러리
- 민지호 - 메인 페이지, 게임 상세 페이지, 유저 페이지, 리뷰, 방명록, 친구 관리, 채팅 / 인증(서버)
- 장성현 - 상점, 채팅
- 한태현 - 결제, 멤버십, api gateway, 게임 라이브러리
---
# 프로젝트 소개
> ## STEAMILK - 게임으로 하나되는 게임 소셜 스토어 플랫폼

## 1. 프로젝트 진행 기간
- 기획/설계 : 2021.12.21 ~ 2022.01.02
- 개발 : 2022.01.03 ~ 2022.02.20

## 2. 기능

### 스토어 기본 기능
- **결제**: 유저의 게임 구매를 위한 머니 충전, 게임 구매
- **상점** : 게임 정보, 게임 리뷰, 장바구니, 찜 목록
- **멤버십** : 유저 로그인, 회원가입, 마이페이지, 방명록, 친구

### 소셜 기능
- **라이브러리**
  - 마이 게임 : 유저가 구매한 게임 목록을 관리. 
  - 마이 룸 : 유저 만의 개인 공간을 꾸려 다른 유저의 참여를 지원
- **채팅** : 1:1채팅, 그룹 채팅


---
## 3. 사용 기술 
### FE
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" /> <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" /> <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" /> <img src="https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white" /> <img src="https://img.shields.io/badge/AXIOS-purple?style=for-the-badge&logo=apache-pulsar&logoColor=white"/> <img src="https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" /> 
---
### BE

 <img src="https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot" /> <img src="https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white" /> <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" /> <img src="https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white" /> <img src="https://img.shields.io/badge/rabbitmq-%23FF6600.svg?&style=for-the-badge&logo=rabbitmq&logoColor=white" /> <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" /> `websocket` `grpc`

---
## 4. 아키텍쳐
![](https://i.imgur.com/cNhTlng.png)

---
## 5. 디렉토리 구조
```
milk
├── bin
├── config
├── data
├── deploy
├── docs
├── resources
├── scripts
└── src
```
[FE 디렉토리 구조](https://github.com/STOVE-Milk/steam-clone/blob/feature/common/src/frontend/README.md#%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B5%AC%EC%A1%B0)
[BE 디렉토리 구조](https://github.com/STOVE-Milk/steam-clone/blob/feature%2Fcommon/src/backend/README.md#%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B5%AC%EC%A1%B0)


---
# 팀 규칙

### 1. 그라운드 룰
[팀 그라운드 룰](https://github.com/STOVE-Milk/steam-clone/wiki/%5BMilk%5D-%ED%8C%80-%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C-%EB%A3%B0)

### 2. 깃 규칙
[깃 규칙](https://github.com/STOVE-Milk/steam-clone/wiki/%5BMilk%5D-%EA%B9%83-%EA%B7%9C%EC%B9%99)
