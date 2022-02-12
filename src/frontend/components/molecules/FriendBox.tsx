import React from 'react';
import styled from 'styled-components';
import Text, { TextStyle } from 'components/atoms/Text';
import Dot from 'components/atoms/Dot';
import { theme } from 'styles/theme';
import Profile from 'components/atoms/Profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export interface IFriend {
  id: number;
  nickname: string;
  profile: {
    image: string | JSX.Element;
    description: string;
  };
  is_friend?: number;
}

export interface FriendBoxProps {
  friendInfo: IFriend;
  open: boolean;
}

const FriendBoxWrapper = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  padding-left: 10px;
  width: 100%;

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

export default function FriendBox(props: FriendBoxProps) {
  return (
    <FriendBoxWrapper>
      {props.friendInfo.profile.image === '' ? (
        <Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />} />
      ) : (
        '실제 이미지'
      )}
      {props.open ? <FriendName types={'small'}>{props.friendInfo.nickname}</FriendName> : null}
      <FriendStatus color={theme.colors.online} />
    </FriendBoxWrapper>
  );
}
