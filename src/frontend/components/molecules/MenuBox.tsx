import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import Text, { TextStyle } from 'components/atoms/Text';

export interface IMenuBoxProps {
  icon: JSX.Element;
  name: string; //메뉴 이름
  page: string; //NavBar에서 클릭 시 이용할 페이지 이름
  open: boolean; //NavBar에서 아이콘만 보이는지(false), 메뉴 이름까지 보이는지(true)
}

export default function MenuBox(props: IMenuBoxProps) {
  return (
    <Link href={`/${props.page}`}>
      <MenuBoxWrapper>
        <MenuIcon open={props.open}>{props.icon}</MenuIcon>
        {props.open ? <MenuTitle types={'main'}>{props.name}</MenuTitle> : null}
      </MenuBoxWrapper>
    </Link>
  );
}

const MenuBoxWrapper = styled.div`
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

const MenuIcon = styled.div<{ open: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${(props) => (props.open ? 0 : '1rem')};
`;

const MenuTitle = styled(Text)`
  margin-left: 20px;
`;
