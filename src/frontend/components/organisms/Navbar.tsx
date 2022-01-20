import React from 'react';
import styled from 'styled-components';
import MenuBox from 'components/molecules/MenuBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faUser } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Logo from 'public/steam_logo.png';
import Profile from 'components/atoms/Profile';
import FriendBox from 'components/molecules/FriendBox';

const NavBarWrapper = styled.div`
  width: 250px;
  height: 100vh;
  background: ${(props) => props.theme.colors.primaryBg};
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow-y: hidden;
`;

const LogoSection = styled.section`
  height: 50px;
  background: ${(props) => props.theme.colors.primaryBg};
  display: flex;
  cursor: pointer;
`;

const LogoBox = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 10px 10px 20px;
`;

const LogoTitle = styled.div`
  color: ${(props) => props.theme.colors.primaryText};
  font-weight: 700;
  font-size: 1.75rem;
  margin-left: 10px;
  margin-top: 2px;
`;

const ToggleBtn = styled.div``;

const SectionTitle = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  padding: 30px 20px 0px 20px;
`;

const MenuSection = styled.div`
  padding: 20px 10px 20px 10px;
`;

const SectionDivider = styled.div`
  height: 1px;
  width: 200px;
  margin: 0 auto;
  background: ${(props) => props.theme.colors.divider};
`;

const FriendSection = styled.div`
  padding: 20px 10px 20px 10px;
  flex: 1;
  overflow-y: scroll;
`;

export default function NavBar() {
  return (
    <NavBarWrapper>
      <LogoSection>
        <LogoBox>
          <Image src={Logo} layout={'fixed'} width={30} height={30}></Image>
          <LogoTitle>STEAM</LogoTitle>
        </LogoBox>
        <ToggleBtn></ToggleBtn>
      </LogoSection>
      <SectionTitle>Menus</SectionTitle>
      <MenuSection>
        <MenuBox icon={<FontAwesomeIcon icon={faGamepad} size="2x" inverse />} name={'Games'} />
        <MenuBox icon={<FontAwesomeIcon icon={faGamepad} size="2x" inverse />} name={'Category'} />
        <MenuBox icon={<FontAwesomeIcon icon={faGamepad} size="2x" inverse />} name={'Favorites'} />
        <MenuBox icon={<FontAwesomeIcon icon={faGamepad} size="2x" inverse />} name={'Wish'} />
      </MenuSection>
      <SectionDivider />
      <SectionTitle>Friends</SectionTitle>
      <FriendSection>
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
        <FriendBox icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />} name={'user'} />
      </FriendSection>
    </NavBarWrapper>
  );
}
