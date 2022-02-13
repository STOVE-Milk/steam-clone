import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

import { gameInfo } from 'modules/game';
import { getGameListAPI } from 'api/game/api';

import Text from 'components/atoms/Text';
import GameSlide from 'components/molecules/GameSlide';
import BigGameSlide from 'components/molecules/BigGameSlide';
import CarouselComponent from 'components/organisms/Carousel';
import BigCarouselComponent from 'components/organisms/BigCarousel';

const Main: NextPage = () => {
  const [rankGames, setRankGames] = useState([] as gameInfo[]); // 다운로드 높은 게임들
  const [saleGames, setSaleGames] = useState([] as gameInfo[]); // 할인률 높은 게임들

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
        <Title types={'large'}>인기 게임</Title>
        <CarouselBox>
          <BigCarouselComponent
            slides={rankGames.map((data) => {
              return <BigGameSlide key={data.id} {...data}></BigGameSlide>;
            })}
          ></BigCarouselComponent>
        </CarouselBox>
        <Title types={'large'}>할인중인 게임</Title>
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

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const Title = styled(Text)`
  margin: 3rem 0 0 3rem;
`;

const CarouselSection = styled.div`
  width: calc(100vw - 250px);
`;

const CarouselBox = styled.div`
  margin: 3rem 0;
`;

export default Main;
