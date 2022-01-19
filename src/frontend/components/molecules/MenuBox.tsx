import React from 'react';
import styled from 'styled-components';
import Text, { TextStyle } from 'components/atoms/Text';
import Link from 'next/link';

export interface IMenuBoxProps {
  icon: JSX.Element;
  name: string;
  page: string;
  open: boolean;
}

interface MenuBoxStyleProps {
  open: boolean;
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

const MenuIcon = styled.div<MenuBoxStyleProps>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${(props) => (props.open ? 0 : '0.5rem')};
`;

const MenuTitle = styled(Text)`
  margin-left: 20px;
  margin-top: 5px;
`;

export default function MenuBox(props: IMenuBoxProps) {
  return (
    <Link href={`/${props.page}`}>
      <MenuBoxWrapper>
        <MenuIcon open={props.open}>{props.icon}</MenuIcon>
        {props.open ? <MenuTitle types={'small'}>{props.name}</MenuTitle> : null}
      </MenuBoxWrapper>
    </Link>
  );
}
