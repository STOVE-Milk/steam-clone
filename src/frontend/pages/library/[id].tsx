import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { IState } from 'modules';
import { saveUserInfo } from 'modules/user';
import { getItemFromLocalStorage } from 'util/getItemFromLocalStorage';
import { parseToken } from 'util/parseToken';

import styled from 'styled-components';
import { GameListLibrary, TitleStyle } from 'components/organisms/GameListLibrary';
import Text from 'components/atoms/Text';
import { Router } from 'react-router-dom';

const NoSSRMap = dynamic(() => import('components/organisms/Map'), {
  ssr: false,
});

export const commandType = {
  INIT: 10,
  SYNC: 11,
  LEAVE: 12,
  MOVE: 20,
  BUILD: 40,
};

const library: NextPage<IState> = () => {
  const [installedGame, setInstalledGame] = useState(null);
  const { userInfo } = useSelector((state: IState) => state.user);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const token = getItemFromLocalStorage('accessToken');

  const onFinishSetGameOffset = () => {
    // 1. 게임 offset설정을 완료하기위함 -> isDragging=false
    // 2. 건물 설치(40) 요청보내기
    //40{
    // "map": {
    //   "side":20,
    //   "gameList":["1"],
    //   "objectList":[],
    //   "games":{
    //      "name": "skull",
    //      "x": 1,
    //      "y": 5
    //    },
    //   "objects":{}
    // }
  };
  const onSelect = (installedGame: any) => {
    console.log(installedGame);
    setInstalledGame(installedGame);
  };
  const resetSelect = () => {
    setInstalledGame(null);
  };

  useEffect(() => {
    console.log('token here=========', token);
    dispatch(saveUserInfo.request(parseToken(token)));
  }, []);

  return (
    <LibraryWrapper>
      {console.log(userInfo.data)}
      <TitleStyle types="large">{`${userInfo.data.nickname}의 라이브러리(구매 게임 목록)`}</TitleStyle>
      <LibraryContentWrapper>
        <NoSSRMap installedGame={installedGame} />
        <GameListLibrary onSelect={onSelect} resetSelect={resetSelect} />
        {/* <button onClick={() => setCount(count + 1)}>add user</button> */}
      </LibraryContentWrapper>
    </LibraryWrapper>
  );
};

const LibraryWrapper = styled.section`
  width: fit-content;
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
`;
const LibraryContentWrapper = styled.section`
  display: flex;
`;
export default library;
