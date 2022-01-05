import React from 'react';
import styled from 'styled-components';
import SubTitle, { SubTitleStyle } from 'components/atoms/SubTitle';

export interface MenuBoxProps {
  icon: JSX.Element;
  name: string;
}

const MenuBoxWrapper = styled.div`
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

const MenuTitle = styled(SubTitle)`
  margin-left: 20px;
  margin-top: 5px;
`;

export default function MenuBox(props: MenuBoxProps) {
  return (
    <MenuBoxWrapper>
      {props.icon}
      <MenuTitle>{props.name}</MenuTitle>
    </MenuBoxWrapper>
  );
}
