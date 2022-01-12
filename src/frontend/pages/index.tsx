import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import CarouselComponent from 'components/organisms/Carousel';
import GameSlide from 'components/molecules/GameSlide';
import gameImage from 'public/game.png';
import gameImage2 from 'public/game2.jpg';
import Image from 'next/image';

const mockData: Array<any> = [
  {
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
`;

const CarouselSection = styled.div`
  width: 1000px;
  border: 1px solid black;
`;

const Main: NextPage = () => {
  return (
    <MainWrapper>
      <CarouselSection>
        <CarouselComponent
          slides={mockData.map((data) => {
            return (
              <GameSlide
                image={<Image src={gameImage2} />}
                info={{
                  name: data.name,
                  price: data.price.kr,
                }}
              ></GameSlide>
            );
          })}
        ></CarouselComponent>
      </CarouselSection>
    </MainWrapper>
  );
};

export default Main;
