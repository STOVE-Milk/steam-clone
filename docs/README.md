- user-join
    - message
    
    ```json
    {
      “action” : “user-join”,
      “message” : ””,
      “target” : null,
      “sender” : {
        “id” : “user_id”,
        “name” : “nickname”
      } 
    }
    ```
    
    - 소켓 연결 시 사용.
    
- user-left
    - message
    
    ```json
    {
      “action” : “user-left”,
      “message” : ””,
      “target” : null,
      “sender” : {
        “id” : “user_id”,
        “name” : “nickname”
      } 
    }
    ```
    

- send-message
    - message
    
    ```jsx
    {
      "action" : "send-message",
      "message" : "너무 어려워^^",
      "target" : {
        "id" : room_id,
        "name" : room_name,
        "private" : boolean  // true면 1:1 채팅 false는 단체 근데 여기선 상관 없음
      }
      "sender" : {
        "id" : user_id,
        "name" : nickname
      }
    }
    ```
    

- room-joined
    - message
    
    ```jsx
    {
      "action" : "room-joined",
      "message" : "",
      "target" : {
        "id" : room_id,
        "name" : room_name,
        "private" : boolean  // true면 1:1 채팅 false면 그룹 채팅
      }
    
    /////////////////1:1 채팅의 경우////////////////////////
      "sender" : {
        "id" : user_id,
        "name" : nickname
      }
    //////////////////////////////////////////////////////
    /////////////////그룹 채팅의 경우////////////////////////
      "sender" : null
    //////////////////////////////////////////////////////
    }
    ```
    
- sendMessageAction
    - message = room_id




[] 초대 메세지 지정.
[] 초대 구현
[] 통신 테스트
[] 이전 채팅 내용 가져오기
  [] message에 채팅 object 추가.
  [] object 마샬링 테스트
  [] object 언마샬링 
