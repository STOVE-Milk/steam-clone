import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { NextPage } from 'next';

import styled from 'styled-components';

import { IState } from 'modules';
// import { getCategories, getGamesByCategory } from 'modules/game';
import * as GameAPI from 'api/game/api';
import { gameInfo } from 'modules/game/types';

import Text from 'components/atoms/Text';
import CategoryList from 'components/molecules/CategoryList';
import GameInfo from 'components/organisms/GameInfo';
import { getGamesByCategory } from 'modules/game';

const Category: NextPage<IState> = () => {
  const [curSelectedCategory, setCurSelectedCategory] = useState('ALL');
  const [categoryList, setCategoryList] = useState([] as string[]);
  const [gameList, setGameList] = useState([] as gameInfo[]);

  useEffect(() => {
    getCategory();
  }, []);
  useEffect(() => {
    getGamesByCategory();
  }, [curSelectedCategory]);
  const { userInfo } = useSelector((state: IState) => state.user);

  const getCategory = async () => {
    const res = await GameAPI.getCategoriesAPI();
    const category_list = await res.data.category_list;
    setCategoryList(category_list);
  };
  const getGamesByCategory = async () => {
    const res = await GameAPI.getGamesByCategoryAPI({ category: `${curSelectedCategory}` });
    const game_list = await res.data.game_list;
    setGameList(game_list);
  };

  return (
    <GameInfoWrapper>
      {console.log(userInfo.data)}
      <ContentWrapper>
        <TitleStyle types="large">카테고리 리스트</TitleStyle>
        <CategoryList
          list={categoryList}
          curSelectedCategory={curSelectedCategory}
          setCurSelectedCategory={setCurSelectedCategory}
        ></CategoryList>
      </ContentWrapper>
      <ContentWrapper>
        <TitleStyle types="large">{`${curSelectedCategory} 게임 리스트 (${gameList?.length})`}</TitleStyle>
        {gameList.map((eachGame, i) => {
          return <GameInfo key={i} {...eachGame} />;
        })}
      </ContentWrapper>
    </GameInfoWrapper>
  );
};

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

export default Category;
