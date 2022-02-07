import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faUser } from '@fortawesome/free-solid-svg-icons';

import { IState } from 'modules';

import Text from 'components/atoms/Text';
import FriendBox from 'components/molecules/FriendBox';
import Profile from 'components/atoms/Profile';

const Wrapper = styled.div`
  padding: 3rem;
`;

const Friend: NextPage = () => {
  // TODO: 로그인 후, 스토어에서 유저 정보 가져오기 (스토어의 userId === 현재 url의 userId 일 때)
  // const { user } = useSelector((state: IState) => state.user);
  // const dispatch = useDispatch();

  useEffect(() => {});

  return (
    <Wrapper>
      <Text types={'title'}>친구 관리</Text>
    </Wrapper>
  );
};

export default Friend;
