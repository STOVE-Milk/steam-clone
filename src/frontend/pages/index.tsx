import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import CarouselComponent from 'components/organisms/Carousel';
import BigCarouselComponent from 'components/organisms/BigCarousel';
import GameSlide from 'components/molecules/GameSlide';
import BigGameSlide from 'components/molecules/BigGameSlide';
import gameImage2 from 'public/game2.jpg';
import gameImage from 'public/game.png';
import Image from 'next/image';

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

const CarouselBox = styled.div`
  margin: 3rem 0;
`;

const Main: NextPage = () => {
  return (
    <MainWrapper>
      <CarouselSection>
        <CarouselBox>
          <BigCarouselComponent
            slides={mockData.map((data) => {
              return (
                <BigGameSlide
                  key={data.id}
                  image={<Image src={gameImage} layout="fill" objectFit="cover" />}
                  info={{
                    name: data.name,
                    price: data.price.kr,
                  }}
                ></BigGameSlide>
              );
            })}
          ></BigCarouselComponent>
        </CarouselBox>
        <CarouselBox>
          <CarouselComponent
            slides={mockData.map((data) => {
              return (
                <GameSlide
                  key={data.id}
                  image={<Image src={gameImage2} layout="responsive" />}
                  info={{
                    name: data.name,
                    price: data.price['KR'],
                  }}
                ></GameSlide>
              );
            })}
          ></CarouselComponent>
        </CarouselBox>
      </CarouselSection>
    </MainWrapper>
  );
};

export default Main;
