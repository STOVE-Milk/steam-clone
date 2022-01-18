import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

const mockData: Array<any> = [
  {
    id: 1,
    name: 'Vampire Survivors',
    price: {
      KR: 10000,
    },
    image: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
  },
  {
    id: 2,
    name: 'Vampire Survivors2',
    price: {
      KR: 10000,
    },
    image: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
  },
  {
    id: 3,
    name: 'Vampire Survivors3',
    price: {
      KR: 10000,
    },
    image: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
  },
  {
    id: 4,
    name: 'Vampire Survivors4',
    price: {
      KR: 10000,
    },
    image: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
  },
  {
    id: 5,
    name: 'Vampire Survivors5',
    price: {
      KR: 10000,
    },
    image: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
  },
];

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
