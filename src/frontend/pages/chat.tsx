import React, { useEffect, useState, useRef } from 'react';
import type { NextPage } from 'next';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import Profile from 'components/atoms/Profile';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import Modal from 'components/atoms/Modal';
import JoinChat from 'components/organisms/JoinChat';
import ChatRoom, { Log } from 'components/organisms/ChatRoom';

interface IRoom {
  //채팅 방 객체 타입
  id: string;
  name: string;
  private: boolean; //개인 채팅방이면 true, 단체 채팅방이면 false
}

const Chat: NextPage = () => {
  const msg = '첫번째 줄\n두번째 줄\n세번째 줄'.split('\n'); // temp message
  const [showModal, setShowModal] = useState(false); // 채팅방 생성 모달을 띄우는가
  const [rooms, setRooms] = useState<IRoom[]>([]); // 채팅방 목록

  // TODO: 밑에 값들을 props로 가지는 채팅 컴포넌트 organism으로 컴포넌트화 하기
  const [curRoom, setCurRoom] = useState(''); // 현재 채팅방 이름
  const [members, setMembers] = useState<string[]>([]); // 채팅방 멤버들
  const [logs, setLogs] = useState<Log[]>([]); // 채팅방 메세지들
  const [message, setMessage] = useState({} as Log); //현재 보낼 메세지, 받을 메세지

  let ws = useRef<WebSocket>(); // 웹 소켓 사용

  // 소켓 통신 시 임시로 사용하는 토큰
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjE0LCJuaWNrbmFtZSI6Im5pY2sxNCIsInJvbGUiOjEsImNvdW50cnkiOiJLUiIsImlhdCI6MTY0NDEzNzUyOCwiZXhwIjoxNjQ0MTQxMTI4fQ.rgF0cR0dhqLOY3yhDuYPHJss4exAeTIfw2H1yAKf_78';
  const userId = 14;
  const nickname = 'nick14';

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(`ws://localhost:8102/ws?token=${token}`); //웹 소켓 연결

      // 서버 -> 클라이언트
      // 웹 소켓 통신 과정에서 서버로부터 받는 메세지들을 action에 따라 처리. 아직 개발중!
      ws.current.onmessage = (e: MessageEvent) => {
        const events = e.data.split('\n');
        events.forEach((event: string) => {
          const serverMessage = JSON.parse(event);

          switch (serverMessage.action) {
            case 'user-join': // 유저 접속
              console.log('user-join', serverMessage.sender);
              // TODO: 친구 온라인 상태 처리
              break;
            case 'room-get': // 유저 접속 시, 채팅방 목록 가져오기
              console.log('room-get', serverMessage.data);
              serverMessage.data.forEach((room: IRoom) => {
                setRooms((rooms) => rooms.concat(room));
              });
              break;
            case 'room-joined': // 채팅방 생성
              console.log('room-joined', serverMessage.target);
              setRooms((rooms) => rooms.concat(serverMessage.target));
              break;
            case 'room-view': // 채팅방 접속 시, 채팅방에 관한 정보 가져오기
              console.log('room-view', serverMessage.data);
              setMembers(serverMessage.data.members);
              setLogs(serverMessage.data.log || []);
              break;
            case 'send-message': // 메세지를 받음
              console.log('send-message', serverMessage);
              setMessage({
                sender_id: serverMessage.sender.id,
                sender_nickname: serverMessage.sender.name,
                content: serverMessage.message,
              });
              let array2 = logs;
              message && array2?.push(message);
              setLogs((array2) => array2);
              break;
          }
        });
      };
    }
  }, []);

  useEffect(() => {
    console.log(message, logs);
  }, [logs, message]);

  const enterRoom = (roomId: string) => {
    // 클->서: 채팅방에 들어감
    ws.current?.send(
      JSON.stringify({
        action: 'room-view',
        target: { id: roomId },
      }),
    );
    setCurRoom(roomId);
  };

  const sendMessage = () => {
    // 클->서: 메세지를 보냄
    ws.current?.send(
      JSON.stringify({
        action: 'send-message',
        message: message.content,
        target: {
          id: curRoom,
        },
      }),
    );
  };

  const leaveRoom = () => {
    // 클->서: 채팅방을 나감
    ws.current?.send(
      JSON.stringify({
        action: 'leave-room',
        message: curRoom,
      }),
    );
  };

  const onSubmit = (selectFriends: number[]) => {
    // 클->서: 채팅방 생성
    // TODO: 개인채팅인지 단체채팅인지 선택하는 뷰랑 로직 추가
    // TODO: 단체채팅일 경우 채팅방 이름 입력 받기
    console.log('submit', selectFriends);

    if (selectFriends.length === 1) {
      ws.current?.send(
        JSON.stringify({
          action: 'join-room-private',
          message: selectFriends[0].toString(),
        }),
      );
    } else {
      let roomName = `publicRoom7-${userId}`;
      selectFriends.forEach((friend) => {
        roomName += `-${friend.toString()}`;
      });

      ws.current?.send(
        JSON.stringify({
          action: 'join-room-public',
          message: roomName,
        }),
      );
    }

    setShowModal(false);
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey) {
      // shift+enter처리
      return;
    }
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <ChatWrapper>
      <ChatListSection>
        {rooms.map((room) => {
          return (
            <ChatListBox key={room.id} onClick={() => enterRoom(room.id)}>
              <Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />} />
              <ChatListName types={'medium'}>{room.name}</ChatListName>
            </ChatListBox>
          );
        })}
        <button onClick={() => setShowModal(true)}>채팅방 생성</button>
        <Modal onClose={() => setShowModal(false)} show={showModal}>
          {/* TODO: 실제 친구 불러오기 */}
          <JoinChat
            friends={[
              {
                id: 59,
                nickname: 'algorithm',
                profile: {
                  image: '',
                  description: '',
                },
              },
              {
                id: 54,
                nickname: 'lococo',
                profile: {
                  image: '',
                  description: '',
                },
              },
              {
                id: 49,
                nickname: 'minjyo',
                profile: {
                  image: '',
                  description: '',
                },
              },
            ]}
            onSubmit={onSubmit}
          ></JoinChat>
        </Modal>
      </ChatListSection>
      <ChatRoomSection>
        <ChatViewBox>
          <ChatRoom members={members} logs={logs}></ChatRoom>{' '}
        </ChatViewBox>
        <button onClick={leaveRoom}>방 떠나기</button>
        <ChatInputBox>
          <ChatInput
            value={message?.content}
            onChange={(e) => setMessage((prev) => ({ ...prev, content: e.target.value }))}
            onKeyPress={(e) => onKeyPress(e)}
          ></ChatInput>
          <ChatButton types="primary" onClick={sendMessage}>
            전송
          </ChatButton>
        </ChatInputBox>
      </ChatRoomSection>
    </ChatWrapper>
  );
};

const ChatWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const ChatListSection = styled.div`
  min-width: 200px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${(props) => props.theme.colors.divider};
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ChatListBox = styled.div`
  width: 100%;
  min-height: 5rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  display: flex;
  align-items: center;
  padding: 0 1rem;
`;

const ChatListName = styled(Text)`
  margin: 0 1rem;
`;

const ChatRoomSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

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

const ChatInputBox = styled.div`
  background: ${(props) => props.theme.colors.secondaryBg};
  height: 5rem;
  display: flex;
  align-items: center;
  padding-left: 1rem;
`;

const ChatInput = styled.textarea`
  flex: 1;
  border: none;
  height: 3rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.primaryText};
  background: transparent;
  padding: 1rem;
  color: ${(props) => props.theme.colors.primaryText};
  word-break: break-word;
  font-size: 1.3rem;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ChatButton = styled(FilledButton)``;

export default Chat;
