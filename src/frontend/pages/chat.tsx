import React from 'react';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { io, Socket } from 'socket.io-client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faUser, faWindowMaximize, faAppleAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

// import { getGame } from 'modules/game';
import wrapper from 'modules/configureStore';
// import { IState } from 'modules';

import Profile from 'components/atoms/Profile';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import MsgBox from 'components/atoms/MsgBox';
import { TextStyle } from 'components/atoms/Text';

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  send: (info: {
    name: string,
    msg: string
  }) => void;
}

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

const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.shiftKey) {
    return;
  }
  if (e.key === 'Enter') {
    // 통신
    // 어떻게 뷰를 계속 추가하지...
    console.log('enter');
  }
};

const Chat: NextPage = () => {
  const chats = [1, 2, 3, 4, 5, 5, 5, 6, 7, 8, 8, 9, 1, 1, 1, 1];
  const msg = '첫번째 줄\n두번째 줄\n세번째 줄'.split('\n');

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
  socket.emit('send', {
    name: 'user1',
    msg: 'msg1',
  });

  socket.on('noArg', () => {
    // ...
  });

  socket.on('basicEmit', (a, b, c) => {
    // a is inferred as number, b as string and c as buffer
  });

  socket.on('withAck', (d, callback) => {
    // d is inferred as string and callback as a function that takes a number as argument
  });

  return (
    <ChatWrapper>
      <ChatListSection>
        {chats.map((chat) => {
          return (
            <ChatListBox>
              <Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />} />
              <ChatListName types={'medium'}>이름</ChatListName>
            </ChatListBox>
          );
        })}
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
          <ChatInput onKeyPress={(e) => onKeyPress(e)}></ChatInput>
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
