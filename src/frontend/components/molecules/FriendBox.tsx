import React from 'react';
import styled from 'styled-components';
import Text, { TextStyle } from 'components/atoms/Text';
import Dot from 'components/atoms/Dot';
import { theme } from 'styles/theme';

export interface FriendBoxProps {
  icon: JSX.Element;
  name: string;
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
      {props.icon}
      {props.open ? <FriendName types={'small'}>{props.name}</FriendName> : null}
      <FriendStatus color={theme.colors.online} />
    </FriendBoxWrapper>
  );
}
