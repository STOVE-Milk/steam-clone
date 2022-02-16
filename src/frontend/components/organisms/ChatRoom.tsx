import React from 'react';

import styled from 'styled-components';

import MsgBox from 'components/atoms/MsgBox';

export interface Log {
  //채팅방 메세지 객체 타입
  sender_id: string;
  sender_nickname: string;
  content: string;
}

export interface IChatRoomProps {
  members: string[]; /// 채팅방 멤버들
  logs: Log[]; // 채팅방 메세지들
}

export default function ChatRoom(props: IChatRoomProps) {
  return (
    <ChatViewBox>
      {props.logs.map((log, key) => {
        return (
          <MsgBox key={key} isMine={true} name={log.sender_nickname}>
            {log.content.split('\n').map((text, key) => (
              <p key={key}> {text} </p>
            ))}
          </MsgBox>
        );
      })}
    </ChatViewBox>
  );
}

const ChatViewBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;
