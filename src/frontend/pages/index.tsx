import React, { useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import DefaultButton from 'components/atoms/DefaultButton';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Home: NextPage = () => {
  return (
    <MainWrapper>
      <DefaultButton types="primary">검색</DefaultButton>
    </MainWrapper>
  );
};

export default Home;
