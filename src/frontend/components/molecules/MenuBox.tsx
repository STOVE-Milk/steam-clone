import React from 'react';
import styled from 'styled-components';
import Text, { TextStyle } from 'components/atoms/Text';
import Link from 'next/link';
import { StringLiteralLike } from 'typescript';

export interface MenuBoxProps {
  icon: JSX.Element;
  name: string;
  page: string;
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

const MenuTitle = styled(Text)`
  margin-left: 20px;
  margin-top: 5px;
`;

export default function MenuBox(props: MenuBoxProps) {
  return (
    <Link href={`/${props.page}`}>
      <MenuBoxWrapper>
        {props.icon}
        {props.open ? <MenuTitle types={'small'}>{props.name}</MenuTitle> : null}
      </MenuBoxWrapper>
    </Link>
  );
}
