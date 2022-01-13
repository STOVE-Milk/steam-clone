import React, { useState } from 'react';
import styled from 'styled-components';
import SearchBox from 'components/molecules/SearchBox';
import Profile from 'components/atoms/Profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

// to do: 영역 잡고, css 로 width 100%, height: 80px 등으로 고정
// 내용물: inputBox, 알림 아이콘, 유저인포

const HeaderStyle = styled.header`
  width: calc(100% - 250px);
  height: 80px;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: ${(props) => props.theme.colors['primaryBg']};
  border-bottom: 1px solid ${(props) => props.theme.colors['divider']};
`;
const SearchBarWrapper = styled.div`
  display: flex;
  width: 80%;
  justify-content: center;
  ${(props) => props.theme.breakpoints.medium} {
    visibility: hidden;
  }
`;
const AlertUserWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 20%;
  justify-content: space-evenly;
  ${(props) => props.theme.breakpoints.medium} {
    width: fit-content;
    > svg,
    div {
      margin-right: 20px;
      position: relative;
      right: 30px;
    }
  }
`;

export default function Header() {
  const [option, setOption] = useState('name');
  const [inputText, setInputText] = useState('');

  return (
    <HeaderStyle>
      <SearchBarWrapper>
        <SearchBox option={option} inputText={inputText} setOption={setOption} setInputText={setInputText} />
      </SearchBarWrapper>
      <AlertUserWrapper>
        <FontAwesomeIcon icon={faBell} inverse />
        <Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />
      </AlertUserWrapper>
    </HeaderStyle>
  );
}
