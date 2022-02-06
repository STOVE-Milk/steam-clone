import React from 'react';
import styled from 'styled-components';
import Text, { TextStyle } from 'components/atoms/Text';
import Dot from 'components/atoms/Dot';
import { theme } from 'styles/theme';

export interface FriendBoxProps {
  icon: JSX.Element;
  name: string;
  open: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const FriendBoxWrapper = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  padding-left: 10px;

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
  flex: 1;
`;

const FriendStatus = styled(Dot)`
  margin-left: 10px;
  margin-right: 20px;
`;

export default function FriendBox(props: FriendBoxProps) {
  return (
    <FriendBoxWrapper onClick={props.onClick}>
      {props.icon}
      {props.open ? <FriendName types={'small'}>{props.name}</FriendName> : null}
      <FriendStatus color={theme.colors.online} />
    </FriendBoxWrapper>
  );
}
