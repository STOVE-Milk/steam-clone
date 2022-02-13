import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { NextPage } from 'next';

import styled from 'styled-components';

import { IState } from 'modules';
import { getCategories, getGamesByCategory } from 'modules/game';

import Text from 'components/atoms/Text';
import CategoryList from 'components/molecules/CategoryList';
import GameInfo from 'components/organisms/GameInfo';

const Category: NextPage<IState> = () => {
  const [curSelectedCategory, setCurSelectedCategory] = useState('ALL');
  const { categories, gamesByCategory } = useSelector((state: IState) => {
    // console.log('state:', state);
    return state.game;
  });
  const { userInfo } = useSelector((state: IState) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    axios.post('http://localhost:8200/auth/email', { email: 'abc' }).then((res) => {
      console.log(res.data);
    });
  });

  useEffect(() => {
    dispatch(getCategories.request({}));
    dispatch(getGamesByCategory.request({ category: `${curSelectedCategory}` }));
    // dispatch(getGamesByCategory.request({ category: '액션' }));
  }, [curSelectedCategory]);

  const gamesByCategoryData = gamesByCategory.data && Object.values(gamesByCategory.data);

  return (
    <GameInfoWrapper>
      {console.log(userInfo.data)}
      <ContentWrapper>
        <TitleStyle types="large">카테고리 리스트</TitleStyle>
        {categories.data && (
          <CategoryList
            list={Object.values(categories.data)}
            curSelectedCategory={curSelectedCategory}
            setCurSelectedCategory={setCurSelectedCategory}
          ></CategoryList>
        )}
      </ContentWrapper>
      <ContentWrapper>
        <TitleStyle types="large">{`${curSelectedCategory} 게임 리스트 (${gamesByCategoryData?.length})`}</TitleStyle>
        {gamesByCategory.loading ? (
          <Text>Loading</Text>
        ) : (
          gamesByCategoryData &&
          gamesByCategoryData.map((eachGame, i) => {
            return <GameInfo key={i} {...eachGame} />;
          })
        )}
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
