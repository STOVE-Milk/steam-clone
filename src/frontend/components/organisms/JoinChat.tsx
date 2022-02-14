import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import Profile from 'components/atoms/Profile';
import FriendBox from 'components/molecules/FriendBox';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';

interface IJoinChatProps {
  friends: Array<{
    name: string;
    id: number;
  }>;
  onSelect: (id: number) => void;
  onSubmit: () => void;
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
  padding: 2rem 0;
`;

export default function JoinChat(props: IJoinChatProps) {
  const [open, setOpen] = useState(true); //채팅방 생성 모달 열림 여부

  useEffect(() => {}, []);

  return (
    <Wrapper>
      <Title types="large">채팅방 생성</Title>
      <Text types="medium">친구 목록</Text>
      <Content>
        <FriendList>
          {props.friends.map((friend) => {
            return (
              <FriendBox
                key={friend.id}
                name={friend.name}
                icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />}></Profile>}
                open={true}
                onClick={() => props.onSelect(friend.id)}
              ></FriendBox>
            );
          })}
        </FriendList>
      </Content>
      <FilledButton onClick={() => props.onSubmit()} types="primary">
        완료
      </FilledButton>
    </Wrapper>
  );
}
