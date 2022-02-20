import React, { useState } from 'react';
import Image from 'next/image';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import profileImg from 'public/Smilemates_Flame_Pose.png';

import Profile from 'components/atoms/Profile';
import SearchBox from 'components/molecules/SearchBox';

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
        <Profile userImage={<Image src={profileImg} width={30} height={30}></Image>} />
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
