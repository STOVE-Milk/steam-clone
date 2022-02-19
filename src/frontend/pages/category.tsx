import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { NextPage } from 'next';

import styled from 'styled-components';

import { IState } from 'modules';
import * as GameAPI from 'api/game/api';
import { gameInfo } from 'modules/game/types';

import Text from 'components/atoms/Text';
import CategoryList from 'components/molecules/CategoryList';
import GameInfo from 'components/organisms/GameInfo';

const Category: NextPage<IState> = () => {
  const { userInfo } = useSelector((state: IState) => state.user);

  //현재 선택된 카테고리를 체크하기 위한 옵션 -> 초기값은 ALL
  const [curSelectedCategory, setCurSelectedCategory] = useState('ALL');
  const [categoryList, setCategoryList] = useState([] as string[]);
  const [gameList, setGameList] = useState([] as gameInfo[]);

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    getGamesByCategory();
  }, [curSelectedCategory]);

  // 카테고리 리스트 불러오는 요청
  const getCategory = async () => {
    const res = await GameAPI.getCategoriesAPI();
    const category_list = await res.data.category_list;
    setCategoryList(category_list);
  };

  // 카테고리에 따른 게임 불러오는 요청
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
          return <GameInfo key={eachGame.id + eachGame.name} {...eachGame} />;
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
