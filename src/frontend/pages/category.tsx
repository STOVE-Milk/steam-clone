import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';

import GameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';
// import IGameInfo from 'pages/category';
import styled from 'styled-components';
import CategoryList from 'components/molecules/CategoryList';

import { useSelector, useDispatch } from 'react-redux';
// import { END } from 'redux-saga';
// import wrapper from 'modules/configureStore';
import { IState } from 'modules';
import { getCategories, getGamesByCategory } from 'modules/game';
import { gameInfo } from 'modules/game/types';
export type GameMedia = {
  main: string;
  sub: Array<string>;
};
// export interface IGameInfo {
//   id: number;
//   name: string;
//   os: Array<string>; // 지원 가능한 os 가 모두 다 오는 식
//   description_snippet: string;
//   price: number;
//   sale: number;
//   image: GameMedia;
//   video: GameMedia;
//   category_list: Array<string>;
// }

// const mockData: Array<IGameInfo> = [
//   {
//     id: 1,
//     name: 'Vampire Survivors',
//     os: ['windows', 'apple'],
//     description_snippet:
//       'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.za',
//     price: 10000,
//     sale: 10,
//     image: {
//       main: 'www',
//       sub: ['www1', 'www2'],
//     },
//     video: {
//       main: 'www',
//       sub: ['www1', 'www2'],
//     },
//     category_list: ['Sandbox', 'RTS', 'FPS', 'MOBA'],
//   },
//   {
//     id: 2,
//     name: 'Vampire Survivors2',
//     os: ['windows'],
//     description_snippet:
//       'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.za',
//     price: 20000,
//     sale: 0,
//     image: {
//       main: 'www',
//       sub: ['www1', 'www2'],
//     },
//     video: {
//       main: 'www',
//       sub: ['www1', 'www2'],
//     },
//     category_list: ['Sandbox', 'RTS', 'FPS'],
//   },
// ];

const GameInfoWrapper = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 2rem;
`;
const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;
const ContentWrapper = styled.div`
  margin-bottom: 2rem;
`;
const Category: NextPage<IState> = () => {
  const [curSelectedCategory, setCurSelectedCategory] = useState('ALL');
  const { categories, gamesByCategory } = useSelector((state: IState) => {
    console.log('state:', state);
    return state.game;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCategories.request({}));
    dispatch(getGamesByCategory.request({ category: `${curSelectedCategory}` }));
    // dispatch(getGamesByCategory.request({ category: '액션' }));
  }, [curSelectedCategory]);

  const gamesByCategoryData = gamesByCategory.data && Object.values(gamesByCategory.data);

  return (
    <GameInfoWrapper>
      {console.log(curSelectedCategory)}
      <ContentWrapper>
        <TitleStyle types="large">카테고리 리스트</TitleStyle>
        {categories.data && (
          <CategoryList list={Object.values(categories.data)} gameLoadFunc={setCurSelectedCategory}></CategoryList>
        )}
      </ContentWrapper>
      <ContentWrapper>
        <TitleStyle types="large">{`${curSelectedCategory}`} 게임 리스트</TitleStyle>
        {gamesByCategoryData &&
          gamesByCategoryData.map((eachGame, i) => {
            return <GameInfo key={i} {...eachGame} />;
          })}
      </ContentWrapper>
    </GameInfoWrapper>
  );
};

// export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ params }) => {
//   store.dispatch(getCategories.request({}));
//   // const data = store.getState();
//   // const gamesByCategoryData = store.getState().game;
//   // const gamesByCategoryData = store.getState().game.gamesByCategory.data;
//   // console.log('data client', data, 'category data ', gamesByCategoryData);
//   // console.log(gamesByCategoryData);
//   return { props: {} };
// });

export default Category;
