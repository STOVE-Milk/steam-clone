import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import { parseToken } from 'util/parseToken';
import { saveUserInfo } from 'modules/user';

import Profile from 'components/atoms/Profile';
import SearchBox from 'components/molecules/SearchBox';
import { IState } from 'modules';

export default function Header() {
  const [option, setOption] = useState('name');
  const [inputText, setInputText] = useState('');

  const userInfo = useSelector((state: IState) => state.user.userInfo);

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const profileImg = localStorage.getItem('profileImg');
    const result = token && parseToken(token);
    result['profileImg'] = profileImg;
    dispatch(saveUserInfo.request(result));
  }, []);

  return (
    <HeaderStyle>
      <SearchBarWrapper>
        <SearchBox option={option} inputText={inputText} setOption={setOption} setInputText={setInputText} />
      </SearchBarWrapper>
      <AlertUserWrapper>
        <FontAwesomeIcon icon={faBell} inverse />
        <Profile profileImg={userInfo.data.profileImg} />
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
