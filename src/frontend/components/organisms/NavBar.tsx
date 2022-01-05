import React from 'react';
import styled from 'styled-components';
import MenuBox from 'components/molecules/MenuBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';

const NavBarWrapper = styled.div`
  width: 200px;
  height: 100%;
  background: ${(props) => props.theme.colors.primaryBg};
  display: flex;
  flex-direction: column;
`;

const TitleSection = styled.div`
  height: 50px;
  background: ${(props) => props.theme.colors.primaryBg};
  padding: 10px;
  display: flex;
`;

const LogoBox = styled.div``;

const ToggleBtn = styled.div``;

const MenuSection = styled.div`
  height: 200px;
  padding: 10px;
`;

const FriendSection = styled.div`
  flex: 1;
`;

export default function NavBar() {
  return (
    <NavBarWrapper>
      <TitleSection>
        <LogoBox></LogoBox>
        <ToggleBtn></ToggleBtn>
      </TitleSection>
      <MenuSection>
        <MenuBox icon={<FontAwesomeIcon icon={faGamepad} size="2x" inverse />} name={'Games'} />
      </MenuSection>
      <FriendSection></FriendSection>
    </NavBarWrapper>
  );
}
