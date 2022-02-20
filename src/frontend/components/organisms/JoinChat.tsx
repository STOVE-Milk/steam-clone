import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { IFriendInfo } from 'modules/user';

import Profile from 'components/atoms/Profile';
import FriendBox from 'components/molecules/FriendBox';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';

interface IJoinChatProps {
  friends: Array<IFriendInfo>;
  onSubmit: (selectFriends: number[], roomName?: string) => void;
}

export default function JoinChat(props: IJoinChatProps) {
  const [selectFriends, setSelectFriends] = useState<string[]>([]); // 채팅방 생성 시 선택한 친구들
  const [roomName, setRoomName] = useState('');
  const [selects, setSelects] = useState<number[]>([]);

  const onSelect = (nickname: string, id: number) => {
    if (selectFriends.includes(nickname)) {
      //선택 해제
      setSelectFriends((friends) => friends.filter((friend) => friend !== nickname));
      setSelects((friends) => friends.filter((friend) => friend !== id));
    } else {
      //선택 추가
      setSelectFriends((friends) => friends.concat(nickname));
      setSelects((friends) => friends.concat(id));
    }
  };

  const onChange = (e: any) => {
    setRoomName(e.target.value);
  };

  return (
    <Wrapper>
      <Title types="large">채팅방 생성</Title>
      <SubTitle types="medium">친구 목록</SubTitle>
      <Content>
        <FriendList>
          {props.friends.map((friend) => {
            return (
              <FriendItem key={friend.id} onClick={onSelect} friendInfo={friend} open={true} types=""></FriendItem>
            );
          })}
        </FriendList>
        <SelectFriendList>
          <SubTitle types="medium">멤버</SubTitle>
          {selectFriends.map((f) => {
            return (
              <SelectFriend>
                <Text types="small">{f}</Text>
              </SelectFriend>
            );
          })}
        </SelectFriendList>
        <RoomNameInput
          placeholder={selectFriends.length < 2 ? '단체 채팅방만 이름 입력이 가능합니다.' : '채팅방 이름을 입력하세요'}
          value={roomName}
          onChange={(e) => onChange(e)}
          disabled={selectFriends.length < 2}
        ></RoomNameInput>
      </Content>
      <SubmitBtn onClick={() => props.onSubmit(selects, roomName)} types="primary">
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
  margin: 0rem 0 3rem 0;
`;

const SubTitle = styled(Text)`
  margin-right: 1rem;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const FriendList = styled.div`
  height: 12rem;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  border-radius: 10px;
  border: 1px solid ${(props) => props.theme.colors.divider};
  padding: 1rem;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const FriendItem = styled(FriendBox)``;

const SelectFriendList = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const SelectFriend = styled.div`
  margin-right: 0.5rem;
  border-radius: 10px;
  padding: 0.5rem;
  background: ${(props) => props.theme.colors.primaryBg};
`;

const RoomNameInput = styled.input`
  border: none;
  border-bottom: 1px solid white;
  padding: 1rem;
  margin: 0.5rem 0 1.5rem 0;
  background: transparent;
  color: ${(props) => props.theme.colors.primaryText};
`;

const SubmitBtn = styled(FilledButton)`
  align-self: center;
`;
