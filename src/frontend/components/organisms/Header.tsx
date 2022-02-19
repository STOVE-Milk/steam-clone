import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

import { IState } from 'modules';

import Profile from 'components/atoms/Profile';
import SearchBox from 'components/molecules/SearchBox';

export default function Header() {
  const [option, setOption] = useState('name');
  const [inputText, setInputText] = useState('');
  const router = useRouter();

  const userInfo = useSelector((state: IState) => state.user.userInfo);

  return (
    <HeaderStyle>
      <SearchBarWrapper>
        <SearchBox option={option} inputText={inputText} setOption={setOption} setInputText={setInputText} />
      </SearchBarWrapper>
      <AlertUserWrapper>
        <FontAwesomeIcon icon={faBell} inverse />
        {/* TO DO: store쪽 이슈때문에 테스트 용으로 Link연결해놓음 -> 드롭다운으로 변경 예정 */}
        <Profile
          onClick={() => router.push(`/user/${userInfo.data.idx}`)}
          userImage={<FontAwesomeIcon icon={faUser} inverse />}
        />
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
