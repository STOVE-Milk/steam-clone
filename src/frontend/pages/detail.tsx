import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

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

const GameDetailBox = styled.div``;

const GameInfoBox = styled.div``;
const GameInfoKey = styled.div``;
const GameInfoValue = styled.div``;

const DevInfoBox = styled.div``;

const Detail: NextPage = () => {
  return (
    <DetailWrapper>
      <GameIntroSection></GameIntroSection>
      <GameDetailSection>
        <GameDetailBox>
          <GameInfoBox>
            <GameInfoKey></GameInfoKey>
            <GameInfoValue></GameInfoValue>
          </GameInfoBox>
          <DevInfoBox></DevInfoBox>
        </GameDetailBox>
      </GameDetailSection>
    </DetailWrapper>
  );
};

export default Detail;
