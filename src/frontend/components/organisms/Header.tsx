import React from 'react';
import styled from 'styled-components';
import Search from 'components/molecules/SearchBox';
import Profile from 'components/atoms/Profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
// to do: 영역 잡고, css 로 width 100%, height: 80px 등으로 고정
// 내용물: inputBox, 알림 아이콘, 유저인포

const HeaderStyle = styled.header`
  width: 100%;
  height: 80px;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-around;
  /* padding: 0 1rem; */
  background: ${(props) => props.theme.colors['primaryBg']};
`;

const AlertUserWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100px;
  justify-content: space-evenly;
`;

export default function Header() {
  return (
    <HeaderStyle>
      <Search />
      <AlertUserWrapper>
        <FontAwesomeIcon icon={faBell} inverse />
        <Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />
      </AlertUserWrapper>
    </HeaderStyle>
  );
}
