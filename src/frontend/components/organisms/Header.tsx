import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import SearchBox from 'components/molecules/SearchBox';
import Profile from 'components/atoms/Profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

// to do: 영역 잡고, css 로 width 100%, height: 80px 등으로 고정
// 내용물: inputBox, 알림 아이콘, 유저인포

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
        {/* TO DO: store쪽 이슈때문에 테스트 용으로 Link연결해놓음 -> 드롭다운으로 변경 예정 */}
        <Link href={'/cart'}>
          <div>
            <Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />
          </div>
        </Link>
      </AlertUserWrapper>
    </HeaderStyle>
  );
}

const HeaderStyle = styled.header`
  width: 100%;
  height: 80px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background: ${(props) => props.theme.colors['primaryBg']};
  border-bottom: 1px solid ${(props) => props.theme.colors['divider']};
`;
const SearchBarWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
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
    }
  }
`;
