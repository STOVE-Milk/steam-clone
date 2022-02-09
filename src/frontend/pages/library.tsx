import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { IState } from 'modules';

import dynamic from 'next/dynamic';

import styled from 'styled-components';

import { GameListLibrary, TitleStyle } from 'components/organisms/GameListLibrary';
import Text from 'components/atoms/Text';

const NoSSRMap = dynamic(() => import('components/organisms/Map'), {
  ssr: false,
});

const LibraryWrapper = styled.section`
  width: fit-content;
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
`;
const LibraryContentWrapper = styled.section`
  display: flex;
`;

const library: NextPage<IState> = () => {
  return (
    <LibraryWrapper>
      <TitleStyle types="large">라이브러리(구매 게임 목록)</TitleStyle>
      <LibraryContentWrapper>
        <NoSSRMap />
        <GameListLibrary />
      </LibraryContentWrapper>
    </LibraryWrapper>
  );
};

export default library;
