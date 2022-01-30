import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faWindowMaximize, faAppleAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { getGame } from 'modules/game';
import { IState } from 'modules';
import { getReviewAPI } from 'pages/api/game/api';

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

interface IResReview {
  id: number;
  user_id: number;
  displayed_name: string;
  content: string;
  recommendation: boolean;
  created_at: string;
  updated_at: string;
}

const Detail: NextPage<IState> = () => {
  const { game } = useSelector((state: IState) => state.game);
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState<IResReview[]>([
    {
      id: 1,
      user_id: 1,
      displayed_name: 'user1',
      content: 'review1\nreview1\nreview2',
      recommendation: false,
      created_at: 'time1',
      updated_at: 'time2',
    },
    {
      id: 2,
      user_id: 2,
      displayed_name: 'user2',
      content: 'review2\nreview2\nreview2',
      recommendation: true,
      created_at: 'time3',
      updated_at: 'time4',
    },
  ]);

  const getReviews = async (id: number) => {
    const res = (await getReviewAPI({ id: id })).data.review_list;
    console.log(res);
    setReviews(res);
  };

  useEffect(() => {
    dispatch(getGame.request({ id: 1 }));
    // getReviews(1);
  }, []);

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
          <GameInfoTitle types="large">{game.data.name}</GameInfoTitle>
          <DescText types="small"> {game.data.description_snippet}</DescText>
        </SnippetBox>
        <Divider />
        <EvaluationBox>
          <GameInfoTitle types="medium">평가</GameInfoTitle>
          <Evaluation>
            <div className="RecommendBox">
              <Text types="large">{`${(game.data.recommend_count / game.data.review_count) * 100}%`}</Text>
              <RecommendCount types="tiny">{`${game.data.review_count}명 중 ${game.data.recommend_count}명 추천`}</RecommendCount>
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
            {game.data.os_list.map((eachOs: string) => {
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
              {game.data.category_list.map((category: string) => {
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
              <Text types="medium"> {`${localePrice(game.data.price, 'KR')}`}</Text>
              <FilledButton types={'primary'}>구매</FilledButton>
              <FilledButton types={'primary'}>장바구니</FilledButton>
            </div>
          </GameBuyBox>
          <DevInfoBox>
            <GameInfoTitle types="medium">개발자 정보</GameInfoTitle>
            <Text types="small">{game.data.publisher.name}</Text>
          </DevInfoBox>
        </GameDetailBox>
      </GameDetailSection>
      <ReviewSection>
        <ReviewTitle types="large">사용자 리뷰</ReviewTitle>
        {reviews.map((review: IResReview) => {
          return (
            // isMine: 로그인했을 때 내 리뷰면 true, 아니면 false
            <GameReview
              isMine={true}
              name={review.displayed_name}
              time={'1시'}
              text={review.content}
              recommendation={review.recommendation}
            ></GameReview>
          );
        })}
      </ReviewSection>
    </DetailWrapper>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ params }) => {
//   store.dispatch(getGame.request({ id: params && Number(params.id) }));

//   return { props: {} };
// });

export default Detail;
