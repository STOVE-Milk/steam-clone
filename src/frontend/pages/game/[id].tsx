import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMaximize, faAppleAlt } from '@fortawesome/free-solid-svg-icons';

import { IState } from 'modules';
import { gameInfo } from 'modules/game';
import * as GameAPI from 'api/game/api';
import { localePrice } from 'util/localeString';

import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import BigGameSlide from 'components/molecules/BigGameSlide';
import CarouselComponent from 'components/organisms/SelectCarousel';
import gameImage1 from 'public/game.png';
import gameImage2 from 'public/game2.jpg';

const Detail: NextPage<IState> = () => {
  const [game, setGame] = useState({} as gameInfo);

  const userId = 1;
  const getGame = async () => {
    // (스토어의 userId !== 현재 url의 userId 일 때)
    const res = (await GameAPI.getGameAPI(userId)).data.game;
    setGame(res);
  };

  useEffect(() => {
    getGame();
  }, []);

  return (
    <DetailWrapper>
      <GameIntroSection>
        <GameTitle types={'title'}>{game.name}</GameTitle>
        <CarouselComponent
          buttons={game.image.sub.map((img, index) => {
            return <Image src={index % 2 ? gameImage1 : gameImage2} layout="fill" objectFit="cover"></Image>;
          })}
          slides={game.image.sub.map((img) => {
            return <BigGameSlide key={game.id} {...game}></BigGameSlide>;
          })}
        ></CarouselComponent>
      </GameIntroSection>
      <GameDetailSection>
        <GameDetailBox>
          <TitleBox>
            <Text types="large"> {game.name}</Text>
            <div className="desc">
              <Text types="small"> {game.description_snippet}</Text>
            </div>
          </TitleBox>
          <OSBox>
            <Text types="medium">지원 가능 OS</Text>
            {game.os_list.map((eachOs: string) => {
              return (
                <div className="OSCol">
                  <FontAwesomeIcon icon={eachOs === 'windows' ? faWindowMaximize : faAppleAlt} inverse />
                  <Text types="small">{eachOs}</Text>
                </div>
              );
            })}
          </OSBox>
          <CategoryBox>
            <Text types="medium">게임 카테고리</Text>
            <div className="categories">
              {game.category_list.map((category: string) => {
                return (
                  <span>
                    <Text types="small">{`#${category}`}</Text>
                  </span>
                );
              })}
            </div>
          </CategoryBox>
          <GameBuyBox>
            <Text types="large"> {game.name}</Text>
            <div className="actionBox">
              <Text types="medium"> {`${localePrice(game.price, 'KR')}원`}</Text>
              <FilledButton types={'primary'}>구매</FilledButton>
              <FilledButton types={'primary'}>장바구니</FilledButton>
            </div>
          </GameBuyBox>
          <DevInfoBox>
            <Text types="medium">개발자 정보</Text>
          </DevInfoBox>
        </GameDetailBox>
      </GameDetailSection>
    </DetailWrapper>
  );
};

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: calc(100vw - 250px);
  ${(props) => props.theme.breakpoints.medium} {
    width: calc(100vw - 190px);
  }
  ${(props) => props.theme.breakpoints.small} {
    width: calc(100vw - 150px);
  }
  margin: 0 auto;
  /* margin-top: 3rem; */
`;

const GameTitle = styled(Text)`
  margin: 3rem 0;
`;

const GameIntroSection = styled.div`
  width: 80%;
`;

const GameDetailSection = styled.div`
  width: 80%;
  margin-top: 3rem;
  border-radius: 10px;
`;

const GameDetailBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const GameInfoBox = styled.div`
  background: ${(props) => props.theme.colors.secondaryBg};
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
`;

const TitleBox = styled(GameInfoBox)`
  .desc {
    padding-top: 1rem;
    line-height: 1.5rem;
  }
`;

const OSBox = styled(GameInfoBox)`
  .OSCol {
    padding-top: 0.5rem;
    align-items: center;
    display: flex;

    > svg {
      margin-right: 1rem;
    }
  }
`;

const CategoryBox = styled(GameInfoBox)`
  .categories {
    padding-top: 0.8rem;
    display: flex;
    flex-wrap: wrap;
  }

  span {
    margin-right: 1rem;
  }
`;

const GameBuyBox = styled(GameInfoBox)`
  display: flex;
  flex-direction: column;

  .actionBox {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 0.5rem;
    ${(props) => props.theme.breakpoints.small} {
      justify-content: flex-start;
    }
  }
`;

const DevInfoBox = styled(GameInfoBox)``;

export default Detail;
