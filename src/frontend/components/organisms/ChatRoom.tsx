import React, { useRef, useCallback, useEffect } from 'react';

import styled from 'styled-components';

import Text from 'components/atoms/Text';
import MsgBox from 'components/atoms/MsgBox';
import AlertMsgBox from 'components/atoms/AlertMsgBox';
import FilledButton from 'components/atoms/FilledButton';

export interface Log {
  //채팅방 메세지 객체 타입
  sender_id: string;
  sender_nickname: string;
  content: string;
  sender_profile?: string;
}

export interface Member {
  id: string;
  name: string;
}

export interface IChatRoomProps {
  members: Member[]; // 채팅방 멤버들
  logs: Log[]; // 채팅방 메세지들
  leaveRoom: () => void;
  userId: number; // 현재 로그인한 유저 아이디
  private: boolean;
}

export default function ChatRoom(props: IChatRoomProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 메세지 추가 시, 스크롤 내리기
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current !== null) {
      scrollRef.current.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });
    }
  }, [props.logs]);

  useEffect(() => {
    scrollToBottom();
  }, [props.logs]);

  return (
    <Wrapper>
      <RoomInfoBox>
        <Text types="small">멤버</Text>
        {props.members.map((member, key) => {
          return <Member key={key}>{member.name}</Member>;
        })}
        {!props.private && (
          <LeaveRoomBtn types="primary" onClick={props.leaveRoom}>
            방 나가기
          </LeaveRoomBtn>
        )}
      </RoomInfoBox>
      <RoomViewBox>
        {props.logs.map((log, key) => {
          return log.sender_id === '' ? (
            <AlertMsgBox key={key}>{log.content}</AlertMsgBox>
          ) : (
            <MsgBox
              key={key}
              isMine={log.sender_id === props.userId.toString()}
              name={log.sender_nickname}
              profile={log.sender_profile!!}
            >
              {log.content && log.content.split('\n').map((text, key) => <p key={key}> {text} </p>)}
            </MsgBox>
          );
        })}
        <div ref={scrollRef} />
      </RoomViewBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
`;

const RoomInfoBox = styled.div`
  width: 100%;
  height: 55px;
  display: flex;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  align-items: center;
  padding: 1rem;
`;

const Member = styled.div`
  margin: 0 0.3rem;
  color: ${(props) => props.theme.colors.primaryText};
`;

const LeaveRoomBtn = styled(FilledButton)`
  margin-left: auto;
`;

const RoomViewBox = styled.div`
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: scroll;
`;
