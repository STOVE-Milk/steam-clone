import React from 'react';
import styled from 'styled-components';
import SubTitle, { SubTitleStyle } from 'components/atoms/SubTitle';
import Dot from 'components/atoms/Dot';
import { theme } from 'styles/theme';

export interface FriendBoxProps {
  icon: JSX.Element;
  name: string;
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

  :hover ${SubTitleStyle} {
    color: ${(props) => props.theme.colors.primaryText};
  }
`;

const FriendName = styled(SubTitle)`
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
    <FriendBoxWrapper>
      {props.icon}
      <FriendName>{props.name}</FriendName>
      <FriendStatus color={theme.colors.online} />
    </FriendBoxWrapper>
  );
}
