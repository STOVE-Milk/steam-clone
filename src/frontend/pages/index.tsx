import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import GameSlide from 'components/molecules/GameSlide';
import gameImage2 from 'public/game2.jpg';
import Image from 'next/image';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'modules';
import { getCategories } from 'modules/game';

const mockData: Array<any> = [
  {
    id: 1,
    name: 'Vampire Survivors',
    price: {
      kr: 10000,
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
      kr: 10000,
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
      kr: 10000,
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
      kr: 10000,
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
      kr: 10000,
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
  const { categories } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories.request({}));
  }, [categories]);

  return (
    <MainWrapper>
      <CarouselSection></CarouselSection>
    </MainWrapper>
  );
};

export default Main;
