import React from 'react';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faWindowMaximize, faAppleAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { getGame } from 'modules/game';
import wrapper from 'modules/configureStore';
import { IState } from 'modules';

import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import { localePrice } from 'util/localeString';

import CarouselComponent from 'components/organisms/SelectCarousel';
import BigGameSlide from 'components/molecules/BigGameSlide';
import gameImage1 from 'public/game.png';
import gameImage2 from 'public/game2.jpg';

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: scroll;
  margin-top: 6rem;
`;

const GameIntroSection = styled.div`
  border: 1px solid white;
  width: 80%;
  height: 500px;
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
    align-items: center;
    padding-top: 0.5rem;
  }
`;

const DevInfoBox = styled(GameInfoBox)``;

const Detail: NextPage<IState> = () => {
  const { game } = useSelector((state: IState) => state.game);
  const array = [1, 2, 3, 4, 5, 6];

  return (
    <DetailWrapper>
      <GameIntroSection>
        <CarouselComponent
          buttons={array.map((data) => {
            return <Image src={data % 2 ? gameImage1 : gameImage2} width={30} height={30}></Image>;
          })}
          slides={array.map((data) => {
            return (
              <BigGameSlide
                key={game.data?.id}
                image={<Image src={data % 2 ? gameImage1 : gameImage2} layout="fill" objectFit="cover" />}
              ></BigGameSlide>
            );
          })}
        ></CarouselComponent>
      </GameIntroSection>
      <GameDetailSection>
        <GameDetailBox>
          <TitleBox>
            <Text types="large"> {game.data && game.data.name}</Text>
            <div className="desc">
              <Text types="small"> {game.data && game.data.description}</Text>
            </div>
          </TitleBox>
          <OSBox>
            <Text types="medium">지원 가능 OS</Text>
            {game.data &&
              game.data.os.map((eachOs: string) => {
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
              {game.data &&
                game.data.category_list.map((category: string) => {
                  return (
                    <span>
                      <Text types="small">{`#${category}`}</Text>
                    </span>
                  );
                })}
            </div>
          </CategoryBox>
          <GameBuyBox>
            <Text types="large"> {game.data && game.data.name}</Text>
            <div className="actionBox">
              <Text types="medium"> {`${game.data && localePrice(game.data.price['KR'], game.data.country)}`}</Text>
              <FilledButton types={'primary'}>구매</FilledButton>
              <FilledButton types={'primary'}>장바구니</FilledButton>
            </div>
          </GameBuyBox>
          <DevInfoBox>
            <Text types="medium">개발자 정보</Text>
            {/* <Text types="small"> {game.data && game.data.name}</Text> */}
          </DevInfoBox>
        </GameDetailBox>
      </GameDetailSection>
    </DetailWrapper>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ params }) => {
  // store.dispatch(getGame.request({ id: params && Number(params.id) }));

  return { props: {} };
});

export default Detail;
