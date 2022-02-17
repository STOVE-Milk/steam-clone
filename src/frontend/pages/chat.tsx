import React, { useEffect, useState, useRef } from 'react';
import type { NextPage } from 'next';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

import { parseToken } from 'util/parseToken';
import { IState } from 'modules';
import { saveUserInfo } from 'modules/user';

import Profile from 'components/atoms/Profile';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import Modal from 'components/atoms/Modal';
import JoinChat from 'components/organisms/JoinChat';
import ChatRoom, { Log } from 'components/organisms/ChatRoom';
import { useDispatch, useSelector } from 'react-redux';

interface IRoom {
  //채팅 방 객체 타입
  id: string;
  name: string;
  private: boolean; //개인 채팅방이면 true, 단체 채팅방이면 false
}

const Chat: NextPage = () => {
  const token = localStorage.getItem('accessToken');

  const userInfo = useSelector((state: IState) => state.user.userInfo);
  const friends = useSelector((state: IState) => state.user.friends.data);

  const [showModal, setShowModal] = useState(false); // 채팅방 생성 모달을 띄우는가
  const [rooms, setRooms] = useState<IRoom[]>([]); // 채팅방 목록
  const [chatInput, setChatInput] = useState(''); //채팅 입력

  const [curRoom, setCurRoom] = useState(''); // 현재 채팅방 이름
  const [members, setMembers] = useState<string[]>([]); // 채팅방 멤버들
  const [logs, setLogs] = useState<Log[]>([]); // 채팅방 메세지들

  const dispatch = useDispatch();

  let ws = useRef<WebSocket>(); // 웹 소켓 사용

  useEffect(() => {
    const result = token && parseToken(token);
    dispatch(saveUserInfo.request(result));
  }, [token]);

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(`ws://fortice.iptime.org:8080/chat/ws?token=${token}`); //웹 소켓 연결
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
              if (serverMessage.data === null) {
                setRooms([]);
              } else {
                serverMessage.data.forEach((room: IRoom) => {
                  setRooms((rooms) => rooms.concat(room));
                });
              }
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
              setLogs((logs) =>
                logs.concat({
                  sender_id: serverMessage.sender.id,
                  sender_nickname: serverMessage.sender.name,
                  content: serverMessage.message,
                }),
              );
              break;
            case 'user-left': // 유저 활동 종료
              console.log('user-left', serverMessage);
              break;
          }
        });
      };
    }
  }, []);

  // 유저 아이디로 유저 닉네임 찾기
  const findNickname = (id: string) => {
    return friends.filter((f) => f.id.toString() === id)[0].nickname.toString();
  };

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
        message: chatInput,
        target: {
          id: curRoom,
        },
      }),
    );
    setChatInput('');
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

  const createRoom = (selectFriends: number[], roomName?: string) => {
    // 클->서: 채팅방 생성
    console.log('submit', selectFriends);

    if (selectFriends.length === 1) {
      ws.current?.send(
        JSON.stringify({
          action: 'join-room-private',
          message: selectFriends[0].toString(),
        }),
      );
    } else {
      let room = `${roomName}-${userInfo.data.idx}`;
      selectFriends.forEach((friend) => {
        room += `-${friend.toString()}`;
      });

      ws.current?.send(
        JSON.stringify({
          action: 'join-room-public',
          message: room,
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
        <CreateChatRoomBtn types={'primary'} onClick={() => setShowModal(true)}>
          채팅방 생성
        </CreateChatRoomBtn>
        {rooms.map((room) => {
          return (
            <ChatListBox key={room.id} onClick={() => enterRoom(room.id)}>
              <Profile
                userImage={
                  room.private ? (
                    <FontAwesomeIcon icon={faUser} inverse width={30} height={30} />
                  ) : (
                    <FontAwesomeIcon icon={faUsers} inverse width={30} height={30} />
                  )
                }
              />
              <ChatListName types={'medium'}>
                {room.private
                  ? findNickname(room.name.split('-').filter((t) => t !== userInfo.data.idx.toString())[0])
                  : room.name}
              </ChatListName>
            </ChatListBox>
          );
        })}
        <Modal onClose={() => setShowModal(false)} show={showModal}>
          <JoinChat friends={friends} onSubmit={createRoom}></JoinChat>
        </Modal>
      </ChatListSection>
      <ChatRoomSection>
        <ChatViewBox>
          {curRoom ? (
            <ChatRoom
              userId={userInfo.data.idx}
              members={members
                .filter((member) => userInfo.data.idx.toString() !== member)
                .map((member) => {
                  return findNickname(member);
                })}
              logs={logs}
              leaveRoom={leaveRoom}
            ></ChatRoom>
          ) : (
            <ChatRoomPlaceholder>방을 선택해주세요</ChatRoomPlaceholder>
          )}
        </ChatViewBox>
        <ChatInputBox>
          <ChatInput
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
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

const CreateChatRoomBtn = styled(FilledButton)`
  margin: 1rem 0;
  align-self: center;
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
  height: calc(100% - 5rem);
`;

const ChatRoomPlaceholder = styled.div`
  color: ${(props) => props.theme.colors.primaryText};
  text-align: center;
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
