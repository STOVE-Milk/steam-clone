import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { IFriend } from 'components/molecules/FriendBox';

import Profile from 'components/atoms/Profile';
import FriendBox from 'components/molecules/FriendBox';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import { select } from 'redux-saga/effects';

interface IJoinChatProps {
  friends: Array<IFriend>;
  onSubmit: (selectFriends: number[], roomName?: string) => void;
}

export default function JoinChat(props: IJoinChatProps) {
  const [selectFriends, setSelectFriends] = useState<number[]>([]); // 채팅방 생성 시 선택한 친구들
  const [roomName, setRoomName] = useState('');

  useEffect(() => {}, [selectFriends]);

  const onSelect = (id: number) => {
    if (selectFriends.includes(id)) {
      //선택 해제
      setSelectFriends((friends) => friends.filter((friend) => friend !== id));
    } else {
      //선택 추가
      setSelectFriends((friends) => friends.concat(id));
    }
  };

  const onChange = (e: any) => {
    setRoomName(e.target.value);
  };

  return (
    <Wrapper>
      <Title types="large">채팅방 생성</Title>
      <Text types="medium">친구 목록</Text>
      <Content>
        <FriendList>
          {props.friends.map((friend) => {
            return (
              <FriendItem
                key={friend.id}
                onClick={onSelect}
                friendInfo={friend}
                selected={selectFriends.includes(friend.id)}
                open={true}
              ></FriendItem>
            );
          })}
        </FriendList>
        <RoomNameInput
          placeholder={selectFriends.length < 2 ? '단체 채팅방만 이름 입력이 가능합니다.' : '채팅방 이름을 입력하세요'}
          value={roomName}
          onChange={(e) => onChange(e)}
          disabled={selectFriends.length < 2}
        ></RoomNameInput>
      </Content>
      <SubmitBtn onClick={() => props.onSubmit(selectFriends, roomName)} types="primary">
        완료
      </SubmitBtn>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem;
`;

const Title = styled(Text)`
  text-align: center;
  margin: 1rem 0 3rem 0;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const FriendList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.divider};
  padding: 1rem;
`;

const FriendItem = styled(FriendBox)`
  margin: 1rem 0;
`;

const RoomNameInput = styled.input`
  border: none;
  border-bottom: 1px solid white;
  padding: 1rem;
  margin: 1rem 0 2rem 0;
  background: transparent;
  color: ${(props) => props.theme.colors.primaryText};
`;

const SubmitBtn = styled(FilledButton)`
  align-self: center;
`;
