import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const CarouselSection = styled.div`
  width: calc(100vw - 250px);
`;

const Main: NextPage = () => {
  return (
    <MainWrapper>
      <CarouselSection></CarouselSection>
    </MainWrapper>
  );
};

export default Main;
