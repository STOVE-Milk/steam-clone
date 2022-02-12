import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGamepad,
  faBars,
  faComments,
  faHeart,
  faBook,
  faCog,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import LogoImage from 'public/steam_logo.png';

import MenuBox from 'components/molecules/MenuBox';
import FriendBox from 'components/molecules/FriendBox';
import { IFriend } from 'components/molecules/FriendBox';

import { theme } from 'styles/theme';
import Link from 'next/link';

interface INavBarStyledProps {
  open: boolean;
}

export default function NavBar() {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  // TODO: 실제 친구 목록 가져오기
  const [friends, setFriends] = useState([] as IFriend[]);

  useEffect(() => {
    const media = window.matchMedia(theme.breakpoints.medium.slice(7));
    const listener = () => {
      if (media.matches) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, []);

  return (
    <NavBarWrapper>
      <LogoSection>
        <LogoBox open={open} onClick={() => router.push('/')}>
          <Image src={LogoImage} layout={'fixed'} width={30} height={30}></Image>
          <LogoTitle>STEAM</LogoTitle>
        </LogoBox>
        <OpenBar open={open} icon={faBars} inverse onClick={() => setOpen(!open)} />
      </LogoSection>
      <SectionTitle>Menus</SectionTitle>
      <MenuSection>
        <MenuBox open={open} page="category" icon={<FontAwesomeIcon icon={faBook} inverse />} name={'카테고리'} />
        <MenuBox open={open} page="library" icon={<FontAwesomeIcon icon={faGamepad} inverse />} name={'라이브러리'} />
        <MenuBox open={open} page="wishlist" icon={<FontAwesomeIcon icon={faHeart} inverse />} name={'위시리스트'} />
        <MenuBox open={open} page="cart" icon={<FontAwesomeIcon icon={faShoppingCart} inverse />} name={'장바구니'} />
        <MenuBox open={open} page="chat" icon={<FontAwesomeIcon icon={faComments} inverse />} name={'채팅'} />
      </MenuSection>
      <SectionDivider />
      <SectionTitle>
        Friends
        <Link href={'/friend'}>
          <FriendSettingBtn>
            <FontAwesomeIcon icon={faCog} inverse></FontAwesomeIcon>
          </FriendSettingBtn>
        </Link>
      </SectionTitle>
      <FriendSection>
        {friends.map((friend) => {
          <FriendBox open={open} friendInfo={friend} />;
        })}
      </FriendSection>
    </NavBarWrapper>
  );
}

const NavBarWrapper = styled.div`
  width: fit-content;
  height: 100vh;
  background: ${(props) => props.theme.colors.primaryBg};
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  z-index: 999;
  padding: 10px;
  overflow-y: hidden;
  border-right: 1px solid white;
  ${(props) => props.theme.breakpoints.small} {
    position: fixed;
  }
`;

const LogoSection = styled.section`
  height: 50px;
  background: ${(props) => props.theme.colors.primaryBg};
  display: flex;
  cursor: pointer;
  padding: 1rem 1rem 1rem 1rem;
`;

const LogoBox = styled.div<INavBarStyledProps>`
  display: flex;
  flex-direction: row;
  display: ${(props) => (props.open ? '' : 'none')};
`;

const LogoTitle = styled.div`
  color: ${(props) => props.theme.colors.primaryText};
  font-weight: 700;
  font-size: 1.75rem;
  margin-left: 1rem;
`;

const OpenBar = styled(FontAwesomeIcon)<INavBarStyledProps>`
  margin-left: ${(props) => (props.open ? '1.5rem' : '1rem')};
  margin-right: ${(props) => (props.open ? '2.5rem' : '1.7rem')};
`;

const SectionTitle = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  padding: 30px 20px 0px 20px;
  display: flex;
`;

const MenuSection = styled.div`
  padding: 20px 10px 20px 10px;
`;

const SectionDivider = styled.div`
  height: 1px;
  width: 100%;
  background: ${(props) => props.theme.colors.divider};
`;

const FriendSection = styled.div`
  padding: 20px 10px 20px 10px;
  flex: 1;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const FriendSettingBtn = styled.div`
  margin-left: auto;
  cursor: pointer;
`;
