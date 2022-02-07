import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';

interface IUserInfoProps {
  id: number;
  nickname: string;
  isFriend: boolean;
  profile: {
    description: string;
    image: string;
  };
}

const Wrapper = styled.div`
  border-radius: 10px;
  background: ${(props) => props.theme.colors.secondaryBg};
  padding: 1rem;
  margin-top: 3rem;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

const AddFriendBtn = styled(FilledButton)`
  margin-left: auto;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 1rem;
`;

const ProfileImage = styled.div`
  border: 1px solid white;
  border-radius: 10px;
  width: 10rem;
  height: 10rem;
`;

const Desc = styled.div`
  border-radius: 10px;
  background: ${(props) => props.theme.colors.secondaryText};
  flex: 1;
  margin-left: 1rem;
  padding: 1rem;
`;

export default function UserInfo(props: IUserInfoProps) {
  return (
    <Wrapper>
      <UserSection>
        <Text types="large">{`${props.nickname} 님`}</Text>
        {props.isFriend ? null : <AddFriendBtn types="primary">친구 추가</AddFriendBtn>}
      </UserSection>
      <ProfileSection>
        <ProfileImage>{props.profile.image ? <Image src={props.profile.image}></Image> : null}</ProfileImage>
        <Desc>{props.profile.description}</Desc>
      </ProfileSection>
    </Wrapper>
  );
}
