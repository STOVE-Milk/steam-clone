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
import GameReview from 'components/organisms/GameReview';
import gameImage1 from 'public/game.png';
import gameImage2 from 'public/game2.jpg';

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
`;

const GameTitle = styled(Text)`
  margin: 3rem 0;
`;

const GameImageSection = styled.div`
  width: 80%;
`;

const GameInfoBox = styled.div`
  background: ${(props) => props.theme.colors.secondaryBg};
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
`;

const GameIntroSection = styled(GameInfoBox)`
  width: 80%;
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
`;

const GameInfoTitle = styled(Text)`
  margin-bottom: 1rem;
`;

const DescText = styled(Text)`
  line-height: 2rem;
`;

const SnippetBox = styled.div``;

const EvaluationBox = styled.div`
  width: 100%;
`;

const Evaluation = styled.div`
  width: 100%;
  display: flex;
  .RecommendBox {
    display: flex;
    align-items: center;
  }
`;

const RecommendCount = styled(Text)`
  margin: 0.5rem 0 0 0.5rem;
`;

const WishButtonBox = styled.div`
  flex: 1;
`;
const WishButton = styled(FilledButton)`
  float: right;
`;

const Divider = styled.div`
  height: 1px;
  background: ${(props) => props.theme.colors.divider};
  margin: 1rem 0;
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

const DescBox = styled(GameInfoBox)``;

const OSBox = styled(GameInfoBox)`
  padding-bottom: 0.5rem;
  .OSCol {
    padding-bottom: 0.5rem;
    align-items: center;
    display: flex;

    > svg {
      margin-right: 1rem;
    }
  }
`;

const CategoryBox = styled(GameInfoBox)`
  .categories {
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
    ${(props) => props.theme.breakpoints.small} {
      justify-content: flex-start;
    }
  }
`;

const DevInfoBox = styled(GameInfoBox)``;

const ReviewSection = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
`;

const ReviewTitle = styled(Text)`
  margin: 0 0 1rem 0.5rem;
`;

const Detail: NextPage<IState> = () => {
  const { game } = useSelector((state: IState) => state.game);
  const array = [1, 2, 3, 4];

  return (
    <DetailWrapper>
      <GameImageSection>
        <GameTitle types={'title'}>{game.data && game.data.name}</GameTitle>
        <CarouselComponent
          buttons={array.map((data) => {
            return <Image src={data % 2 ? gameImage1 : gameImage2} layout="fill" objectFit="cover"></Image>;
          })}
          slides={array.map((data) => {
            return (
              <BigGameSlide
                key={game.data?.id}
                image={<Image src={data % 2 ? gameImage1 : gameImage2} layout="responsive" />}
              ></BigGameSlide>
            );
          })}
        ></CarouselComponent>
      </GameImageSection>
      <GameIntroSection>
        <SnippetBox>
          <GameInfoTitle types="large">{game.data && game.data.name}</GameInfoTitle>
          <DescText types="small"> {game.data && game.data.description_snippet}</DescText>
        </SnippetBox>
        <Divider />
        <EvaluationBox>
          <GameInfoTitle types="medium">평가</GameInfoTitle>
          <Evaluation>
            <div className="RecommendBox">
              <Text types="large">{`${game.data && (game.data.recommend_count / game.data.review_count) * 100}%`}</Text>
              <RecommendCount types="tiny">{`${game.data && game.data.review_count}명 중 ${
                game.data && game.data.recommend_count
              }명 추천`}</RecommendCount>
            </div>
            <WishButtonBox>
              <WishButton types="primary">위시리스트</WishButton>
            </WishButtonBox>
          </Evaluation>
        </EvaluationBox>
      </GameIntroSection>
      <GameDetailSection>
        <GameDetailBox>
          <DescBox>
            <GameInfoTitle types="medium">게임 상세 설명</GameInfoTitle>
            <DescText types="small"> {game.data && game.data.description}</DescText>
          </DescBox>
          <OSBox>
            <GameInfoTitle types="medium">지원 가능 OS</GameInfoTitle>
            {game.data &&
              game.data.os_list.map((eachOs: string) => {
                return (
                  <div className="OSCol">
                    <FontAwesomeIcon icon={eachOs === 'Window' ? faWindowMaximize : faAppleAlt} inverse />
                    <Text types="small">{eachOs}</Text>
                  </div>
                );
              })}
          </OSBox>
          <CategoryBox>
            <GameInfoTitle types="medium">게임 카테고리</GameInfoTitle>
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
            <GameInfoTitle types="medium">구매 정보</GameInfoTitle>
            <div className="actionBox">
              <Text types="medium"> {`${game.data && localePrice(game.data.price, 'KR')}`}</Text>
              <FilledButton types={'primary'}>구매</FilledButton>
              <FilledButton types={'primary'}>장바구니</FilledButton>
            </div>
          </GameBuyBox>
          <DevInfoBox>
            <GameInfoTitle types="medium">개발자 정보</GameInfoTitle>
            <Text types="small">{game.data && game.data.publisher.name}</Text>
          </DevInfoBox>
        </GameDetailBox>
      </GameDetailSection>
      <ReviewSection>
        <ReviewTitle types="large">사용자 리뷰</ReviewTitle>
        <GameReview></GameReview>
      </ReviewSection>
    </DetailWrapper>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ params }) => {
//   store.dispatch(getGame.request({ id: params && Number(params.id) }));

//   return { props: {} };
// });

export default Detail;
