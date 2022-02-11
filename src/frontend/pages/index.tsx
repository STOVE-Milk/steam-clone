import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import CarouselComponent from 'components/organisms/Carousel';
import BigCarouselComponent from 'components/organisms/BigCarousel';
import GameSlide from 'components/molecules/GameSlide';
import BigGameSlide from 'components/molecules/BigGameSlide';
import gameImage2 from 'public/game2.jpg';
import gameImage from 'public/game.png';
import Image from 'next/image';
import { getGameListAPI } from './api/game/api';
import Text from 'components/atoms/Text';
import { IGameInfo } from 'components/molecules/GameSlide';

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
  const [rankGames, setRankGames] = useState([] as IGameInfo[]); // 다운로드 높은 게임들
  const [saleGames, setSaleGames] = useState([] as IGameInfo[]); // 할인률 높은 게임들

  const getGames = async () => {
    setRankGames((await getGameListAPI('category=ALL&page=1&size=5&sort=download_count,desc')).data.game_list);
    setSaleGames((await getGameListAPI('category=ALL&page=1&size=5&sort=sale,desc')).data.game_list);
  };

  useEffect(() => {
    getGames();
  }, []);

  return (
    <MainWrapper>
      <CarouselSection>
        <Text types={'large'}>인기 게임</Text>
        <CarouselBox>
          <BigCarouselComponent
            slides={rankGames.map((data) => {
              return <BigGameSlide key={data.id} {...data}></BigGameSlide>;
            })}
          ></BigCarouselComponent>
        </CarouselBox>
        <Text types={'large'}>할인중인 게임</Text>
        <CarouselBox>
          <CarouselComponent
            slides={saleGames.map((data) => {
              return <GameSlide key={data.id} {...data}></GameSlide>;
            })}
          ></CarouselComponent>
        </CarouselBox>
      </CarouselSection>
    </MainWrapper>
  );
};

export default Main;
