import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

import Text from 'components/atoms/Text';

const Wrapper = styled.div`
  padding: 3rem;
`;

const MyPage: NextPage = () => {
  return (
    <Wrapper>
      <Text types={'title'}>마이페이지</Text>
    </Wrapper>
  );
};

export default MyPage;
