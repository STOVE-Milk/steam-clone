### 에러코드
- 5자리 0/0/000  (앞 1자리: 담당자, 중간 1자리: 서버, 뒤 3자리: 성공/에러번호)
- src/common/ErrorCode.json 에서 공통 관리

### 개발자 번호
- 민지호: 1
- 장성현: 3
- 한태현: 7

### 서버별 번호
- 인증 서버: 0, 
- 상점 서버: 1, 
- 채팅 서버: 3, 
- 멤버십 서버: 5,
- 로비 서버: 6,
- 결제 서버: 7, 
- 실시간 할인 서버: 8,
- CMS 서버: 9 

### 성공/에러 번호
- 성공번호  : 000
  - 예시) 10000: 민지호님의 인증 서버 성공
- 에러번호  : 1XX~7XX|8XX~9XX (오류 주체(클라이언트|서버) 1자리 + 개인별 에러 코드 2자리)
  - 예시) 33404: 장성현님의 채팅 서버 Request Error (Body Validation Error)