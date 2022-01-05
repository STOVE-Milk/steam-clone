import React from 'react';
import styled from 'styled-components';
import SubTitle, { SubTitleStyle } from 'components/atoms/SubTitle';
import Dot from 'components/atoms/Dot';

export interface MenuBoxProps {
  icon: JSX.Element;
  name: string;
}

const FriendBoxWrapper = styled.div`
  display: flex;
  height: 50px;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;

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
`;

export default function MenuBox(props: MenuBoxProps) {
  return (
    <FriendBoxWrapper>
      {props.icon}
      <FriendName>{props.name}</FriendName>
    </FriendBoxWrapper>
  );
}
