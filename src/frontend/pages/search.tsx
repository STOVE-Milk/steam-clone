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
        <TitleStyle types="large">검색결과</TitleStyle>

        {searchData.data &&
          searchData.data.map((eachGame, i) => {
            return <GameInfo key={eachGame.id + eachGame.name} {...eachGame} />;
          })}
      </SearchResultWrapper>
    </>
  );
};
const SearchResultWrapper = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
`;
const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;
export default search;
