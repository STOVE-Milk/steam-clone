import Link from 'next/link';
import styled from 'styled-components';
import React from 'react';
import Image from 'next/image';
import steamLogo from 'public/steam_logo.png';
import { theme } from 'styles/theme';
import Button from 'components/atoms/Button';
import { useRouter } from 'next/router';

interface HeaderProps {}

const HeaderWrapper = styled.div`
  width: 100%;
  height: 100px;
  background: ${(props) => props.theme.colors.header};
  display: flex;
`;

const HeaderLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0.5;
  cursor: pointer;
`;

const HeaderMenu = styled.div`
  font-size: 30px;
  flex: 1.5;
  color: white;
  margin: auto 0;
  text-align: center;
  cursor: pointer;
`;

export default function Header() {
  const router = useRouter();

  return (
    <HeaderWrapper>
      <Link href="/">
        <HeaderLogo>
          <Image src={steamLogo} width={50} height={50}></Image>
        </HeaderLogo>
      </Link>
      <Link href="/store">
        <HeaderMenu>상점</HeaderMenu>
      </Link>
      {/* <Button onClick={() => router.replace('/test')}></Button> */}
      <Link href="/live">
        <HeaderMenu>라이브</HeaderMenu>
      </Link>
      <Link href="/category">
        <HeaderMenu>장바구니</HeaderMenu>
      </Link>
      <Link href="/user">
        <HeaderMenu>유저</HeaderMenu>
      </Link>
    </HeaderWrapper>
  );
}
