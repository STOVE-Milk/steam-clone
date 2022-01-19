import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'modules';
import { getGame } from 'modules/game';

const DetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: scroll;
`;

const GameIntroSection = styled.div`
  border: 1px solid white;
  width: 100%;
  height: 500px;
`;

const GameDetailSection = styled.div`
  width: 100%;
  border: 1px solid white;
  margin-top: 3rem;
`;

const GameDetailBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const GameInfoCol = styled.div``;
const GameInfoBox = styled.div``;
const GameInfoKey = styled.div``;
const GameInfoValue = styled.div``;

const DevInfoBox = styled.div``;

const Detail: NextPage = () => {
  // TODO: detail/${id}로 라우팅되게

  const { game } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getGame.request({ id: 1 }));
  // }, [game]);

  return (
    <DetailWrapper>
      <GameIntroSection></GameIntroSection>
      <GameDetailSection>
        <GameDetailBox>
          <GameInfoBox>
            <GameInfoCol>
              <GameInfoKey>이름</GameInfoKey>
              <GameInfoValue>{game.data.name}</GameInfoValue>
            </GameInfoCol>
          </GameInfoBox>
          <DevInfoBox></DevInfoBox>
        </GameDetailBox>
      </GameDetailSection>
    </DetailWrapper>
  );
};

export default Detail;
