import React, { useEffect, useState, useRef } from 'react';
import type { NextPage } from 'next';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import Profile from 'components/atoms/Profile';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import MsgBox from 'components/atoms/MsgBox';
import Modal from 'components/atoms/Modal';
import JoinChat from 'components/organisms/JoinChat';

const ChatWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const ChatListSection = styled.div`
  width: 20%;
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

interface IServerMessage {
  action: string;
  message: string;
  target: null | IRoom;
  sender: null | IUser;
  data: null | IRoom | IRoomIn;
}

interface IUser {
  id: string;
  name: string;
}

interface IRoom {
  id: string;
  name: string;
  private: boolean;
}

interface IRoomIn {
  members: string[];
  log: Log[];
}

interface Log {
  sender_id: string;
  sender_nickname: string[];
  content: string;
  send_time: string;
}

// interface Message {
//   id: string;
//   name: string;
//   message: string;
// }

const Chat: NextPage = () => {
  const msg = '첫번째 줄\n두번째 줄\n세번째 줄'.split('\n');
  const [showModal, setShowModal] = useState(false);
  const [selectFriends, setSelectFriends] = useState<number[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  // 채팅 컴포넌트 organism에 들어갈 것들
  const [curRoom, setCurRoom] = useState('');
  const [members, setMembers] = useState<string[]>();
  const [logs, setLogs] = useState<Log[]>();
  const [message, setMessage] = useState({} as Log); //현재 보낼 메세지, 받을 메세지

  let ws = useRef<WebSocket>();

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjE0LCJuaWNrbmFtZSI6Im5pY2sxNCIsInJvbGUiOjEsImNvdW50cnkiOiJLUiIsImlhdCI6MTY0NDEzNzUyOCwiZXhwIjoxNjQ0MTQxMTI4fQ.rgF0cR0dhqLOY3yhDuYPHJss4exAeTIfw2H1yAKf_78';

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(`ws://localhost:8102/ws?token=${token}`);

      ws.current.onmessage = (e: MessageEvent) => {
        const serverMessage = e.data;

        switch (serverMessage.action) {
          case 'user-join':
            console.log('user-join', serverMessage.data);
            break;
          case 'room-get':
            console.log('room-get', serverMessage.data);
            setRooms(serverMessage.data);
            break;
          case 'room-joined':
            console.log('room-joined', serverMessage.target);
            if (serverMessage.target.private) {
              //나눠야할까?
            }
            let array = rooms;
            array.push(serverMessage.target);
            setRooms(array);
            break;
          case 'room-view':
            console.log('room-view', serverMessage.data);
            setMembers(serverMessage.data.members);
            setLogs(serverMessage.data.log);
            break;
          case 'send-message':
            console.log('send-message', serverMessage);
            setMessage({
              sender_id: serverMessage.sender.id,
              sender_nickname: serverMessage.sender.name,
              send_time: '1시',
              content: serverMessage.message,
            });
            setMembers(serverMessage.data.members);
            let array2 = logs;
            message && array2?.push(message);
            setLogs(array2);
            break;
        }
      };
    }
  }, []);

  const inRoom = (roomId: string) => {
    ws.current?.send(
      JSON.stringify({
        action: 'room-view',
        target: { id: roomId },
      }),
    );
    setCurRoom(roomId);
  };

  const sendMessage = () => {
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

  const onSubmit = () => {
    // TODO: 개인채팅인지 단체채팅인지 선택하는 뷰랑 로직 추가
    // TODO: 단체채팅일 경우 채팅방 이름 입력 받기
    ws.current?.send(
      JSON.stringify({
        action: 'join-room-private',
        message: selectFriends[0].toString(),
      }),
    );

    ws.current?.send(
      JSON.stringify({
        action: 'join-room-public',
        message: `publicRoom${selectFriends.map((friend) => {
          return `-${friend}`;
        })}`.toString(),
      }),
    );
  };

  const onSelect = (id: number) => {
    let array = selectFriends;
    array.push(id);
    setSelectFriends(array);
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey) {
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
            <ChatListBox key={room.id} onClick={() => inRoom(room.id)}>
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
              { name: 'user1', id: 1 },
              { name: 'user2', id: 2 },
              { name: 'user3', id: 3 },
            ]}
            onSelect={onSelect}
            onSubmit={onSubmit}
          ></JoinChat>
        </Modal>
      </ChatListSection>
      <ChatRoomSection>
        <ChatViewBox>
          {/* TODO: 채팅 컴포넌트 oragnism 만들어서 빼기. msg가 Logs로 대체될 예정 */}
          <MsgBox isMine={true}>
            {msg.map((text, key) => (
              <p key={key}> {text} </p>
            ))}
          </MsgBox>
          <MsgBox isMine={false}>
            {msg.map((text, key) => (
              <p key={key}> {text} </p>
            ))}
          </MsgBox>
        </ChatViewBox>
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

export default Chat;
