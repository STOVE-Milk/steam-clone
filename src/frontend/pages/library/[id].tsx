import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import styled from 'styled-components';

import { IState } from 'modules';
import { saveUserInfo } from 'modules/user';
import { getItemFromLocalStorage } from 'util/getItemFromLocalStorage';
import { parseToken } from 'util/parseToken';
import { makeUniqueArr } from 'util/makeUniqueArr';
import { colorPalette } from 'util/colorPalette';
import { getUserData } from 'modules/game';

import { GameListLibrary, TitleStyle } from 'components/organisms/GameListLibrary';

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
export interface IMapInfo {
  side: number;
  gameList: number[];
  objectList?: number[];
  games: {
    [id: number]: { name: string; x: number; y: number };
  };
  objects?: {
    name?: string;
    x?: number;
    y?: number;
  };
}

const library: NextPage<IState> = () => {
  const [installedGame, setInstalledGame] = useState(null);
  const [installedGameList, setInstalledGameList] = useState([]);
  const [gameOffset, setGameOffset] = useState({ x: 0, y: 0 });

  const [mapInfo, setMapInfo] = useState({
    side: 9,
    gameList: [2],
    objectList: [],
    games: {
      2: { name: 'PUBG: BATTLEGROUNDS', x: 0, y: 0 }, //dummy
    },
    objects: {},
  } as IMapInfo);
  const { userInfo } = useSelector((state: IState) => state.user);
  const { userData } = useSelector((state: IState) => state.game); //유저가 가지고있는 게임정보 (wishlist, purchase list)

  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const token = getItemFromLocalStorage('accessToken');

  const onFinishSetGameOffset = (installedGame: any) => {
    // (TO DO) 1. 게임 offset설정을 완료하기위함(게임을 map 에 설치 완료한 후) -> isDragging=false

    // (DONE) 2. 건물 설치(40) 요청보내기
    const game_id: number = installedGame['id'];
    setMapInfo((prev) => ({
      ...prev,
      gameList: makeUniqueArr([...prev.gameList], game_id),
      games: {
        ...prev.games,
        [game_id]: { name: installedGame.name, x: gameOffset.x, y: gameOffset.y },
      },
    }));
  };
  const onInstallGame = (installedGame: any) => {
    console.log(installedGame);
    setInstalledGameList(installedGame);
  };
  const onUnInstallGame = (game_id: number) => {
    //배열에서 해당 애들 삭제해야하는데, 그럴려면 인자가 뭐가 필요하려나? 게임id? 게임 id 가 같은 거 삭제
    console.log(game_id);
    // setInstalledGameList()
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
    dispatch(getUserData.request({}));
  }, []);

  return (
    <LibraryWrapper>
      {/* 지금 url에 있는 id 가져와서 유저 구매 게임 정보 및 정보들 가져와야함 */}
      {console.log(router.query.id)}
      {console.log(userInfo.data)}
      {console.log(mapInfo)}
      <TitleWrapeer>
        <TitleStyle types="large">{`${userInfo.data.nickname}의 라이브러리(구매 게임 목록), 내 색깔 `}</TitleStyle>
        <MyColor color={`${colorPalette[Math.round(100 % userInfo.data.idx)]}`}></MyColor>
      </TitleWrapeer>
      <LibraryContentWrapper>
        <NoSSRMap
          installedGame={installedGame}
          mapInfo={mapInfo}
          gameOffset={gameOffset}
          setGameOffset={setGameOffset}
        />
        <GameListLibrary
          purchaseList={userData.data.purchase_list}
          onSelect={onSelect}
          resetSelect={resetSelect}
          onFinishSetGameOffset={onFinishSetGameOffset}
        />
        {/* <button onClick={() => setCount(count + 1)}>add user</button> */}
      </LibraryContentWrapper>
    </LibraryWrapper>
  );
};
const TitleWrapeer = styled.section`
  display: flex;
`;

const MyColor = styled.div<{ color: string }>`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background: ${(props) => props.color};
`;

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
