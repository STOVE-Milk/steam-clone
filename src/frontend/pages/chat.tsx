import React, { useEffect, useContext, useState } from 'react';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { io } from 'socket.io-client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser, faWindowMaximize, faAppleAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import wrapper from 'modules/configureStore';
// import { IState } from 'modules';

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

const Message = styled.div``;

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
// const Chat: NextPage<IState> = () => {
//   const { game } = useSelector((state: IState) => state.game);

//   return <div></div>;
// };

const Chat: NextPage = () => {
  const chats = [1, 2];
  const msg = '첫번째 줄\n두번째 줄\n세번째 줄'.split('\n');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectFriends, setSelectFriends] = useState<number[]>([]);

  let ws: WebSocket;

  useEffect(() => {
    ws = new WebSocket('ws://localhost:8102/ws');
    ws.onopen = () => {
      console.log('connected!!');
    };
    // return () => {
    //   socket.off('receive data');
    // };
  }, []);

  const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.shiftKey) {
      return;
    }
    if (e.key === 'Enter') {
      // 통신
      // 어떻게 뷰를 계속 추가하지...
      console.log('enter');

      ws &&
        ws.send(
          JSON.stringify({
            action: 'send-message',
            message: message,
            target: {
              id: 'd4aa5931-3c32-414c-8d07-5442d0976d02',
              name: '2-3',
            },
          }),
        );
    }
  };

  const onSelect = (id: number) => {
    let array = selectFriends;
    array.push(id);
    setSelectFriends(array);
  };

  const onSubmit = () => {
    ws &&
      ws.send(
        JSON.stringify({
          action: 'room-joined',
          message: '',
          sender: {
            id: '3',
            name: 'user3',
          },
        }),
      );

    console.log(selectFriends);
  };

  return (
    <ChatWrapper>
      <ChatListSection>
        {chats.map((chat) => {
          return (
            <ChatListBox key={chat}>
              <Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />} />
              <ChatListName types={'medium'}>이름</ChatListName>
            </ChatListBox>
          );
        })}
        <button onClick={() => setShowModal(true)}>채팅방 생성</button>
        <Modal onClose={() => setShowModal(false)} show={showModal}>
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => onKeyPress(e)}
          ></ChatInput>
          <ChatButton types="primary">전송</ChatButton>
        </ChatInputBox>
      </ChatRoomSection>
    </ChatWrapper>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ params }) => {
//   // store.dispatch(getGame.request({ id: params && Number(params.id) }));

//   return { props: {} };
// });

export default Chat;
