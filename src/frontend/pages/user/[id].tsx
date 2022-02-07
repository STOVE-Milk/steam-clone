import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { IState } from 'modules';
import { getProfileAPI } from '../api/user/api';

import Text from 'components/atoms/Text';
import UserInfo from 'components/organisms/UserInfo';

const Wrapper = styled.div`
  padding: 3rem;
`;

const MyPage: NextPage = () => {
  // TODO: 로그인 후, 스토어에서 유저 정보 가져오기 (스토어의 userId === 현재 url의 userId 일 때)
  // const { user } = useSelector((state: IState) => state.user);
  // const dispatch = useDispatch();

  useEffect(() => {
    // (스토어의 userId !== 현재 url의 userId 일 때)
    // getProfileAPI({ id: 1 });
  });

  return (
    <Wrapper>
      <Text types={'title'}>마이페이지</Text>
      <UserInfo
        id={1}
        nickname={'user1'}
        isFriend={false}
        profile={{
          description: 'desc',
          image: '',
        }}
      ></UserInfo>
    </Wrapper>
  );
};

export default MyPage;
