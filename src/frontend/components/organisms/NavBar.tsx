import React from 'react';
import styled from 'styled-components';
import { createLogicalOr } from 'typescript';

const NavBarWrapper = styled.div`
  width: 100px;
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
      <MenuSection></MenuSection>
      <FriendSection></FriendSection>
    </NavBarWrapper>
  );
}
