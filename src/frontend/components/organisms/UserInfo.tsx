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
`;

const UserSection = styled.div``;

const ProfileSection = styled.div`
  display: flex;
`;

const ProfileImage = styled.div`
  border: 1px solid white;
  border-radius: 10px;
`;

const Desc = styled.div`
  border-radius: 10px;
  border: 1px solid white;
  flex: 1;
  margin-left: 1rem;
`;

export default function UserInfo(props: IUserInfoProps) {
  return (
    <Wrapper>
      <UserSection>
        <Text types="large">{`${props.nickname} 님`}</Text>
        {props.isFriend ? null : <FilledButton types="primary">친구 추가</FilledButton>}
      </UserSection>
      <ProfileSection>
        <ProfileImage>
          <Image src={props.profile.image}></Image>
          <Desc>{props.profile.description}</Desc>
        </ProfileImage>
      </ProfileSection>
    </Wrapper>
  );
}
