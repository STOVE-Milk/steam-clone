import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

import Text from 'components/atoms/Text';
import UserInfo from 'components/organisms/UserInfo';

const Wrapper = styled.div`
  padding: 3rem;
`;

const MyPage: NextPage = () => {
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
