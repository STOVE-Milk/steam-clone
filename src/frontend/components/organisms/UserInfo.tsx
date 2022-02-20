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
      <ProfileSection>
        <ProfileImage>
          {props.profile && props.profile.image !== '' ? (
            <Image src={props.profile.image} width={100} height={100}></Image>
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

const ProfileSection = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 1rem;
`;

const ProfileImage = styled.div`
  border-radius: 10px;
  width: 10rem;
  height: 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Desc = styled.span`
  display: inline-block;
  position: relative;
  background: ${(props) => props.theme.colors.activeBg};
  height: fit-content;
  width: fit-content;
  border-radius: 10px;
  padding: 1rem;
  line-height: 1.3rem;
  margin: auto 0;

  :after {
    position: absolute;
    border-top: 15px solid ${(props) => props.theme.colors.activeBg};
    border-left: 15px solid transparent;
    top: 10px;
    left: -10px;
  }
`;
