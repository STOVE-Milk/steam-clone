import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { NextPage } from 'next';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faComments, faPlus } from '@fortawesome/free-solid-svg-icons';

import { parseToken } from 'util/parseToken';
import { IState } from 'modules';
import { saveUserInfo, SET_ONLINE, SET_OFFLINE } from 'modules/user';

import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import Modal from 'components/atoms/Modal';
import JoinChat from 'components/organisms/JoinChat';
import ChatRoom, { Log, Member } from 'components/organisms/ChatRoom';

interface IRoom {
  //채팅 방 객체 타입
  id: string;
  name: string;
  private: boolean; //개인 채팅방이면 true, 단체 채팅방이면 false
}

const Chat: NextPage = () => {
  const userInfo = useSelector((state: IState) => state.user.userInfo);
  const friends = useSelector((state: IState) => state.user.friends.data);
  const socket = useSelector((state: IState) => state.user.socket.data);

  const [showModal, setShowModal] = useState(false); // 채팅방 생성 모달을 띄우는가
  const [rooms, setRooms] = useState<IRoom[]>([]); // 채팅방 목록
  const [chatInput, setChatInput] = useState(''); //채팅 입력

  const [curRoom, setCurRoom] = useState(''); // 현재 채팅방 이름
  const [members, setMembers] = useState<Member[]>([]); // 채팅방 멤버들
  const [logs, setLogs] = useState<Log[]>([]); // 채팅방 메세지들
  const [isPrivate, setPrivate] = useState(true); // 현재 채팅방이 개인/단체 채팅방인가

  const dispatch = useDispatch();

  let ws = useRef<WebSocket>(); // 웹 소켓 사용

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const profileImg = localStorage.getItem('profileImg');
    const result = token && parseToken(token);
    result['profileImg'] = profileImg;
    dispatch(saveUserInfo.request(result));
  }, []);

  useEffect(() => {
    ws.current = socket;
    if (ws.current !== undefined) {
      //서버 -> 클라이언트
      ws.current.onmessage = (e: MessageEvent) => {
        const events = e.data.split('\n');
        events.forEach((event: string) => {
          const serverMessage = JSON.parse(event);
          switch (serverMessage.action) {
            case 'user-join': // 유저 접속
              console.log('user-join', serverMessage.sender);
              dispatch({
                type: SET_ONLINE,
                payload: Number(serverMessage.sender.id),
              });
              break;
            case 'room-get': // 유저 접속 시, 채팅방 목록 가져오기
              console.log('room-get', serverMessage.data);
              if (serverMessage.data === null) {
                setRooms([]);
              } else {
                setRooms(serverMessage.data);
              }
              break;
            case 'room-joined': // 채팅방 생성
              console.log('room-joined', serverMessage.target);
              setRooms((rooms) => rooms.concat(serverMessage.target));
              break;
            case 'room-view': // 채팅방 접속 시, 채팅방에 관한 정보 가져오기
              console.log('room-view', serverMessage);
              const data = serverMessage.data;
              setMembers(data.members);
              setLogs(data.log);
              setPrivate(serverMessage.target.private);
              break;
            case 'send-message': // 메세지를 받음
              console.log('send-message', serverMessage);
              if (serverMessage.sender && serverMessage.message !== '') {
                // 실제 채팅을 보낸 경우
                setLogs((logs) =>
                  logs.concat({
                    sender_id: serverMessage.sender.id,
                    sender_nickname: serverMessage.sender.name,
                    content: serverMessage.message,
                    sender_profile: serverMessage.sender.profile,
                  }),
                );
              } else {
                // 유저가 단체 채팅방을 나간 경우
                const leaveUser = serverMessage.message.split(' ')[0];
                setMembers(serverMessage.data.members);
                setLogs((logs) =>
                  logs.concat({
                    sender_id: '',
                    sender_nickname: leaveUser,
                    content: `${leaveUser}님이 방을 나갔습니다.`,
                  }),
                );
              }
              break;
            case 'user-left': // 유저 활동 종료
              console.log('user-left', serverMessage);
              dispatch({
                type: SET_OFFLINE,
                payload: Number(serverMessage.sender.id),
              });
              break;
          }
        });
      };

      ws.current.onopen = () => ws.current?.send('hello');
    }
  }, []);

  useEffect(() => {
    getRooms();
  }, []);

  // 유저 아이디로 유저 닉네임 찾기
  const findNickname = (id: string) => {
    const user = friends.filter((f) => f.id.toString() === id);
    if (user.length > 0) {
      return user[0].nickname.toString();
    }
    return 'user';
  };

  const getRooms = () => {
    // 클->서: 채팅방을 불러옴
    ws.current?.send(
      JSON.stringify({
        action: 'room-get',
      }),
    );
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
    getRooms();
    setCurRoom('');
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
        <CreateChatRoomBtn onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} inverse width={30} height={30} size={'2x'} />
        </CreateChatRoomBtn>
        {rooms.map((room) => {
          return (
            <ChatListBox key={room.id} onClick={() => enterRoom(room.id)}>
              <ProfileWrapper>
                {room.private ? (
                  <FontAwesomeIcon icon={faUser} inverse width={30} height={30} />
                ) : (
                  <FontAwesomeIcon icon={faUsers} inverse width={30} height={30} />
                )}
              </ProfileWrapper>
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
              members={members.filter((member) => member.id !== userInfo.data.idx.toString())}
              logs={logs}
              leaveRoom={leaveRoom}
              private={isPrivate}
            ></ChatRoom>
          ) : (
            <ChatRoomPlaceholder>
              <FontAwesomeIcon icon={faComments} inverse size={'2x'} />
              <Text types="medium">채팅방을 선택해주세요</Text>
            </ChatRoomPlaceholder>
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
  position: relative;
`;

const CreateChatRoomBtn = styled.div`
  margin: 1rem 0;
  align-self: center;
  position: absolute;
  bottom: 10px;
  width: 50px;
  height: 50px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.secondaryBg};
  cursor: pointer;

  :hover {
    background: ${(props) => props.theme.colors.activeBg};
  }
`;

const ChatListBox = styled.div`
  width: 100%;
  min-height: 5rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  display: flex;
  align-items: center;
  padding: 0 1rem;
  cursor: pointer;
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
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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

const ProfileWrapper = styled.div`
  min-width: 30px;
  height: 30px;
  border-radius: 30px;
  background: ${(props) => props.theme.colors.secondaryBg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Chat;
