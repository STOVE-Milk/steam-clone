import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowMaximize, faAppleAlt } from '@fortawesome/free-solid-svg-icons';
import placeHolder from 'public/game_placeholder.png';

import { parseToken } from 'util/parseToken';
import { localePrice } from 'util/localeString';
import { IState } from 'modules';
import { gameInfo } from 'modules/game/types';
import * as GameAPI from 'api/game/api';
import * as ReviewAPI from 'api/review/api';
import { saveUserInfo } from 'modules/user';

import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import BigGameSlide from 'components/molecules/BigGameSlide';
import CarouselComponent from 'components/organisms/SelectCarousel';
import GameReview, { IReview } from 'components/organisms/GameReview';

const Detail: NextPage<IState> = () => {
  const [game, setGame] = useState({} as gameInfo); //하나의 게임에 대한 정보
  const userInfo = useSelector((state: IState) => state.user.userInfo.data);
  const [reviews, setReviews] = useState([] as IReview[]);
  const [userReview, setUserReview] = useState({} as IReview);
  const [isFirst, setIsFirst] = useState(true); //유저가 작성 중인 리뷰 내용

  const router = useRouter();
  const gameId = Number(router.query.id) || 1;

  const getGame = async () => {
    const res = (await GameAPI.getGameAPI(gameId)).data.game;
    setGame(res);
  };

  const getReviews = async () => {
    const res = (await ReviewAPI.getReviewAPI(gameId)).data.review_list;
    setReviews(res);

    const myReview = res.filter((r: IReview) => r.user_id === userInfo.idx);
    if (myReview.length > 0) {
      setIsFirst(false);
      setUserReview(myReview[0]);
    }
  };

  const addReview = async (content: string, recommend: boolean) => {
    await ReviewAPI.addReviewAPI(gameId, { content: content, recommendation: recommend ? 1 : 0 });
    getReviews();
  };

  const modifyReview = async (id: number, content: string, recommend: boolean) => {
    await ReviewAPI.modifyReviewAPI(gameId, { review_id: id, content: content, recommendation: recommend ? 1 : 0 });
    getReviews();
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const result = token && parseToken(token);
    dispatch(saveUserInfo.request(result));

    getGame();
    getReviews();
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
              <div className="priceBox">
                {game.sale != 0 && <SaleBadge>-{game.sale}%</SaleBadge>}
                <div>
                  {game.sale ? (
                    <>
                      <DefaultPrice types={'small'}>{`${game.price && localePrice(game.price, 'KR')}`}</DefaultPrice>
                      <Text types="medium">{`${
                        game.price && localePrice((game.price / 100) * (100 - game.sale), 'KR')
                      }`}</Text>
                    </>
                  ) : (
                    <Text types="medium">{`${game.price && localePrice(game.price, 'KR')}`}</Text>
                  )}
                </div>
              </div>
              <FilledButton types={'primary'}>구매</FilledButton>
              <FilledButton types={'primary'}>장바구니</FilledButton>
            </div>
          </GameBuyBox>
        </GameDetailBox>
      </GameDetailSection>
      <ReviewSection>
        <ReviewTitle types="large">사용자 리뷰</ReviewTitle>
        <ReviewTitle types="medium">내 리뷰</ReviewTitle>
        <GameReview
          isFirst={isFirst}
          review={userReview}
          userInfo={userInfo}
          addReview={addReview}
          modifyReview={modifyReview}
        ></GameReview>
        <ReviewTitle types="medium">다른 유저 리뷰</ReviewTitle>
        {reviews
          .filter((r) => r.user_id !== userInfo.idx)
          .map((review: IReview) => {
            return (
              <GameReview key={review.id} isFirst={false} review={review} modifyReview={modifyReview}></GameReview>
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

  .priceBox {
    display: flex;
    align-items: center;

    > div {
      margin-left: 0.5rem;
    }
  }
`;

const SaleBadge = styled(Text)`
  background-color: ${(props) => props.theme.colors.activeBg};
  border-radius: 10px;

  width: 4rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DefaultPrice = styled(Text)`
  text-decoration: line-through;
  font-weight: 400;
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
