import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMaximize, faAppleAlt } from '@fortawesome/free-solid-svg-icons';

import { IState } from 'modules';
import { gameInfo } from 'modules/game/types';
import * as GameAPI from 'api/game/api';
import * as ReviewAPI from 'api/review/api';
import { localePrice } from 'util/localeString';

import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import BigGameSlide from 'components/molecules/BigGameSlide';
import CarouselComponent from 'components/organisms/SelectCarousel';
import GameReview from 'components/organisms/GameReview';

interface IReview {
  //리뷰 객체 타입
  id: number;
  user_id: number;
  displayed_name: string;
  content: string;
  recommendation: boolean;
  created_at: string;
  updated_at: string;
}

const Detail: NextPage<IState> = () => {
  const [game, setGame] = useState({} as gameInfo); //하나의 게임에 대한 정보
  // TODO: API/resType으로 만들기, 다른 곳도 통일
  // 하나의 게임에 대한 리뷰
  const [reviews, setReviews] = useState([] as IReview[]);
  const [userReview, setUserReview] = useState({ content: '', recommendation: true }); //유저가 작성 중인 리뷰 내용

  const router = useRouter();
  const gameId = Number(router.query.id) || 1;

  const getGame = async () => {
    const res = (await GameAPI.getGameAPI(gameId)).data.game;
    setGame(res);
  };

  const getReviews = async () => {
    const res = (await ReviewAPI.getReviewAPI(gameId)).data.review_list;
    setReviews(res);
  };

  const addReview = async () => {
    await ReviewAPI.addReviewAPI(gameId, { content: '', recommendation: false });
    getReviews();
  };

  const modifyReview = async (id: number) => {
    await ReviewAPI.modifyReviewAPI(gameId, { review_id: id, content: '', recommendation: false });
    getReviews();
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserReview({ ...userReview, content: e.target.value });
  };

  const setRecommend = (r: boolean) => {
    setUserReview({ ...userReview, recommendation: r });
  };

  useEffect(() => {
    getGame();

    // getReviews();
  }, []);

  return (
    <DetailWrapper>
      <GameImageSection>
        <GameTitle types={'title'}>{game.name}</GameTitle>
        {game.image !== undefined && (
          <CarouselComponent
            buttons={game.image.sub.slice(0, 4).map((img) => {
              return <Image src={img} layout="fill" objectFit="cover"></Image>;
            })}
            slides={game.image.sub.slice(0, 4).map((img) => {
              return <BigGameSlide key={game.id} id={game.id} src={img}></BigGameSlide>;
            })}
          ></CarouselComponent>
        )}
      </GameImageSection>
      <GameIntroSection>
        <SnippetBox>
          <GameInfoTitle types="large">{game.name}</GameInfoTitle>
          <DescText types="small"> {game.description_snippet}</DescText>
        </SnippetBox>
        <Divider />
        <EvaluationBox>
          <GameInfoTitle types="medium">평가</GameInfoTitle>
          <Evaluation>
            <div className="RecommendBox">
              <Text types="large">{`${
                game.recommend_count && game.review_count && (game.recommend_count / game.review_count) * 100
              }%`}</Text>
              <RecommendCount types="tiny">{`${game.review_count}명 중 ${game.recommend_count}명 추천`}</RecommendCount>
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
            <DescText types="small"> {game.description}</DescText>
          </DescBox>
          <OSBox>
            <GameInfoTitle types="medium">지원 가능 OS</GameInfoTitle>
            {game.os_list &&
              game.os_list.map((eachOs: string) => {
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
              {game.category_list &&
                game.category_list.map((category: string) => {
                  return (
                    <span key={category}>
                      <Text types="small">{`#${category}`}</Text>
                    </span>
                  );
                })}
            </div>
          </CategoryBox>
          <GameBuyBox>
            <GameInfoTitle types="medium">구매 정보</GameInfoTitle>
            <div className="actionBox">
              <Text types="medium"> {`${game.price && localePrice(game.price, 'KR')}`}</Text>
              <FilledButton types={'primary'}>구매</FilledButton>
              <FilledButton types={'primary'}>장바구니</FilledButton>
            </div>
          </GameBuyBox>
        </GameDetailBox>
      </GameDetailSection>
      <ReviewSection>
        <ReviewTitle types="large">사용자 리뷰</ReviewTitle>
        <GameReview
          isMine={false}
          name={'username'}
          time={'1시'}
          text={'abc'}
          recommendation={true}
          isFirst={true}
          userReview={userReview}
          onChange={onChange}
          addReview={addReview}
          setRecommend={setRecommend}
        ></GameReview>
        {reviews.map((review: IReview) => {
          return (
            <GameReview
              key={review.id}
              reviewId={review.id}
              isMine={true}
              name={review.displayed_name}
              time={'1시'}
              text={review.content}
              recommendation={review.recommendation}
              isFirst={false}
              userReview={userReview}
              onChange={onChange}
              modifyReview={modifyReview}
              setRecommend={setRecommend}
            ></GameReview>
          );
        })}
      </ReviewSection>
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

const ReviewSection = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
`;

const ReviewTitle = styled(Text)`
  margin: 0 0 1rem 0.5rem;
`;

export default Detail;
