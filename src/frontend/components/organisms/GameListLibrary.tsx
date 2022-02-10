import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import styled from 'styled-components';

import { IState } from 'modules';
import { getGameInfoByIdList } from 'modules/game';

export const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;

const GameListWrapper = styled.div`
  border: 1px solid black;
`;

const EachGameInfoBox = styled(FilledButton)`
  max-width: 200px;
  display: -webkit-box;
  word-wrap: break-word;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 54px;
`;

interface IGameListLibararyProps {
  onSelect: (e: any) => void;
}

export const GameListLibrary = (props: IGameListLibararyProps) => {
  const { userData, gamesByIdList } = useSelector((state: IState) => state.game);

  // userData
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGameInfoByIdList.request({ idList: userData.data.purchase_list }));
  }, []);

  return (
    <GameListWrapper>
      {/* 게임의 설치 상태에 따라서 button types를 다르게 */}
      {gamesByIdList.data.map((eachGame) => {
        return (
          <>
            <EachGameInfoBox types="active">{eachGame.name}</EachGameInfoBox>
            <button onClick={() => props.onSelect(eachGame)}>Select</button>
          </>
        );
      })}
    </GameListWrapper>
  );
};
