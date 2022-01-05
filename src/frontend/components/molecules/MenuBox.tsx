import React from 'react';
import styled from 'styled-components';
import SubTitle from 'components/atoms/SubTitle';

export interface MenuBoxProps {
  icon: JSX.Element;
  name: string;
}

const MenuBoxWrapper = styled.div`
  display: flex;
  padding: 10px 10px 10px 20px;
  height: 50px;
  align-items: center;
`;

const MenuTitle = styled(SubTitle)`
  margin-left: 20px;
`;

export default function MenuBox(props: MenuBoxProps) {
  return (
    <MenuBoxWrapper>
      {props.icon}
      <MenuTitle>{props.name}</MenuTitle>
    </MenuBoxWrapper>
  );
}
