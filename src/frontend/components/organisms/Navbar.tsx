import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faUser, faBars, faComments, faHeart, faBook } from '@fortawesome/free-solid-svg-icons';
import Logo from 'public/steam_logo.png';

import MenuBox from 'components/molecules/MenuBox';
import Profile from 'components/atoms/Profile';
import FriendBox from 'components/molecules/FriendBox';

import { theme } from 'styles/theme';

interface INavBarStyledProps {
  open: boolean;
}

const NavBarWrapper = styled.div`
  width: fit-content;
  height: 100vh;
  background: ${(props) => props.theme.colors.primaryBg};
  display: flex;
  flex-direction: column;
  position: fixed;
  padding: 10px;
  overflow-y: hidden;
`;

const LogoSection = styled.section`
  height: 50px;
  background: ${(props) => props.theme.colors.primaryBg};
  display: flex;
  cursor: pointer;
`;

const LogoBox = styled.div<INavBarStyledProps>`
  display: flex;
  flex-direction: row;
  padding: 10px 10px 10px 20px;
  display: ${(props) => (props.open ? '' : 'none')};
  
`;

const LogoTitle = styled.div`
  color: ${(props) => props.theme.colors.primaryText};
  font-weight: 700;
  font-size: 1.75rem;
  margin: 0.3rem 0 0 10px;
`;

const HamBar = styled(FontAwesomeIcon)<INavBarStyledProps>`
  margin: auto 0;
  margin-left: ${(props) => (props.open ? '1.5rem' : '1.7rem')};
  margin-right: ${(props) => (props.open ? '1.5rem' : '1.5rem')};
`;

const SectionTitle = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  padding: 30px 20px 0px 20px;
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

export default function NavBar() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('screen and (max-width: 1047px)');
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
        <LogoBox open={open}>
          <Image src={Logo} layout={'fixed'} width={30} height={30}></Image>
          <LogoTitle>STEAM</LogoTitle>
        </LogoBox>
        <HamBar open={open} icon={faBars} size="2x" inverse onClick={() => setOpen(!open)} />
      </LogoSection>
      <SectionTitle>Menus</SectionTitle>
      <MenuSection>
        <MenuBox open={open} page="game" icon={<FontAwesomeIcon icon={faGamepad} size="2x" inverse />} name={'Game'} />
        <MenuBox
          open={open}
          page="category"
          icon={<FontAwesomeIcon icon={faBook} size="2x" inverse />}
          name={'Category'}
        />
        <MenuBox open={open} page="chat" icon={<FontAwesomeIcon icon={faComments} size="2x" inverse />} name={'Chat'} />
        <MenuBox open={open} page="wish" icon={<FontAwesomeIcon icon={faHeart} size="2x" inverse />} name={'Wish'} />
      </MenuSection>
      <SectionDivider />
      <SectionTitle>Friends</SectionTitle>
      <FriendSection>
        <FriendBox open={open} icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
      </FriendSection>
    </NavBarWrapper>
  );
}
