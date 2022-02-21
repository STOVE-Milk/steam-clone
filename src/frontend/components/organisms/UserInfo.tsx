import React from 'react';
import Image from 'next/image';

import styled from 'styled-components';
import profileImg from 'public/Smilemates_Flame_Pose.png';

import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';

export interface IUserInfo {
  id: number;
  nickname: string;
  is_friend: number;
  profile: {
    description: string;
    image: string;
  };
  accessed_at?: string;
  createad_at?: string;
}

export default function UserInfo(props: IUserInfo) {
  return (
    <Wrapper>
      <UserSection>
        <Text types="large">{`${props.nickname} 님`}</Text>
      </UserSection>
      <ProfileSection>
        <ProfileImage>
          {props.profile && props.profile.image !== '' ? (
            <Image src={props.profile.image}></Image>
          ) : (
            <Image src={profileImg}></Image>
          )}
        </ProfileImage>
        <Desc>{props.profile && props.profile.description}</Desc>
      </ProfileSection>
    </Wrapper>
  );
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
