import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NextPage } from 'next';

import styled from 'styled-components';

import { IState } from 'modules';

import Text from 'components/atoms/Text';
import GameInfo from 'components/organisms/GameInfo';

const search: NextPage<IState> = (props) => {
  const { searchData } = useSelector((state: IState) => state.game);

  return (
    // <div>ddd{console.log(searchData.data.inputText.trim() game_list)}</div>
    <>
      <SearchResultWrapper>
        <TitleStyle types="large">{`검색결과`}</TitleStyle>
        <Text>{`${searchData.data.length}개의 결과입니다.`}</Text>

        {searchData.data.length ? (
          searchData.data.map((eachGame, i) => {
            return <GameInfo key={eachGame.id + eachGame.name} {...eachGame} />;
          })
        ) : (
          <Text>일치하는 데이터가 없습니다</Text>
        )}
      </SearchResultWrapper>
    </>
  );
};
const SearchResultWrapper = styled.div`
  width: 60rem;
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
`;
const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;
export default search;
