import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import CarouselComponent from 'components/organisms/Carousel';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CarouselSection = styled.div`
  width: 1000px;
  border: 1px solid black;
`;

const Main: NextPage = () => {
  return (
    <MainWrapper>
      <CarouselSection>
        <CarouselComponent />
      </CarouselSection>
    </MainWrapper>
  );
};

export default Main;
