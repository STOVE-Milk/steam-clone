import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { theme } from 'styles/theme';
import Text, { TextStyle } from 'components/atoms/Text';
import Dot from 'components/atoms/Status';
import Profile from 'components/atoms/Profile';

export interface IFriend {
  //친구 객체 타입
  id: number;
  nickname: string;
  profile: {
    image: string | JSX.Element;
    description: string;
  };
  is_friend?: number;
}

export interface IFriendBoxProps {
  friendInfo: IFriend;
  open: boolean; //아이콘만 보이는지(false), 이름과 온라인 상태까지 보이는지 (true)
  selected?: boolean; //채팅방 생성 시 친구가 선택되었는지
  onClick?: (id: number) => void; //채팅방 생성 시 친구 선택
}

export default function FriendBox(props: IFriendBoxProps) {
  return (
    <FriendBoxWrapper
      onClick={() => {
        props.onClick && props.onClick(props.friendInfo.id);
      }}
    >
      {props.friendInfo.profile.image === '' ? (
        <Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />} />
      ) : (
        '실제 이미지'
      )}
      {props.open ? <FriendName types={'small'}>{props.friendInfo.nickname}</FriendName> : null}
      {props.open ? <FriendStatus color={theme.colors.online} /> : null}
    </FriendBoxWrapper>
  );
}

const FriendBoxWrapper = styled.div<{ selected?: boolean }>`
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  padding-left: 10px;
  width: 100%;
  ${(props) =>
    props.selected &&
    css`
      background: ${props.theme.colors.activeBg};
    `}

  :hover {
    background: ${(props) => props.theme.colors.activeBg};
  }

  :hover ${TextStyle} {
    color: ${(props) => props.theme.colors.primaryText};
  }
`;

const FriendName = styled(Text)`
  margin-left: 20px;
  margin-top: 5px;
`;

const FriendStatus = styled(Dot)`
  margin-left: 20px;
  margin-right: 30px;
`;
