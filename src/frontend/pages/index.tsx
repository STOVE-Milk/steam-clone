import React, { useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import SearchBar from 'components/organisms/SearchBar';
import Button from 'components/atoms/Button';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Home: NextPage = () => {
  return (
    <MainWrapper>
      <SearchBar />
      {/* <Button>버튼</Button> */}
    </MainWrapper>
  );
};

export default Home;
