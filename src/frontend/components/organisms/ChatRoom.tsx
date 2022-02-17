import React from 'react';

import styled from 'styled-components';

import MsgBox from 'components/atoms/MsgBox';
import FilledButton from 'components/atoms/FilledButton';

export interface Log {
  //채팅방 메세지 객체 타입
  sender_id: string;
  sender_nickname: string;
  content: string;
}

export interface IChatRoomProps {
  members: string[]; // 채팅방 멤버들
  logs: Log[]; // 채팅방 메세지들
  leaveRoom: () => void;
  userId: number; // 현재 로그인한 유저 아이디
}

export default function ChatRoom(props: IChatRoomProps) {
  return (
    <Wrapper>
      <RoomInfoBox>
        {props.members
          .filter((member) => props.userId.toString() !== member)
          .map((member, key) => {
            return <Member key={key}>{member}</Member>;
          })}
        <LeaveRoomBtn types="primary" onClick={props.leaveRoom}>
          방 나가기
        </LeaveRoomBtn>
      </RoomInfoBox>
      <RoomViewBox>
        {props.logs.map((log, key) => {
          return (
            <MsgBox key={key} isMine={log.sender_id === props.userId.toString()} name={log.sender_nickname}>
              {log.content && log.content.split('\n').map((text, key) => <p key={key}> {text} </p>)}
            </MsgBox>
          );
        })}
      </RoomViewBox>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const RoomInfoBox = styled.div`
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  align-items: center;
  padding-left: 1rem;
`;

const Member = styled.div`
  margin: 0 0.3rem;
  color: ${(props) => props.theme.colors.primaryText};
`;

const LeaveRoomBtn = styled(FilledButton)`
  margin-left: auto;
`;

const RoomViewBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;
