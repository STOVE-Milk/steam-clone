import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
import { source } from 'util/imageSource';
import { getGameInfoByUser, getUserData } from 'modules/game';

import Text from 'components/atoms/Text';
import { GameListLibrary } from 'components/organisms/GameListLibrary';
// import * as GameAPI from 'api/game/api'; //getGameInfoByIdListAPI

// import { getGameInfoByUserAPI } from 'api/game/api';
// import { gameInfo } from 'modules/game/types';
// import { isEmpty } from '../../util/isEmpty';

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
  const { userInfo } = useSelector((state: IState) => state.user);
  const { userData, gameOffsetData, gameInfoByUser } = useSelector((state: IState) => state.game); //유저가 가지고있는 게임정보 (wishlist, purchase list)

  const { friends } = useSelector((state: IState) => state.user);

  const [installedGame, setInstalledGame] = useState({});
  const [installedGameList, setInstalledGameList] = useState(gameInfoByUser.data);
  const [gameOffsetList, setGameOffsetList] = useState(gameOffsetData.data); // {id :{x:0,y:0}}

  const [mapInfo, setMapInfo] = useState({
    side: 9,
    gameList: [],
    objectList: [],
    games: {
      // 2: { name: 'PUBG: BATTLEGROUNDS', x: 50, y: 50 }, //dummy
    },
    objects: {},
  } as IMapInfo);
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
        [game_id]: { name: installedGame.name, x: gameOffsetList[game_id].x, y: gameOffsetList[game_id].y },
      },
    }));
  };
  const onInstallGame = (installedGame: any) => {
    console.log(installedGame);
    setInstalledGameList((prev) => ({ ...prev, ...installedGame }));
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
    setInstalledGame({});
  };

  // useEffect(() => {
  //   typeof router.query.id == 'string' ? dispatch(getGameInfoByUser.request({ user_id: router.query.id })) : null;
  //   setInstalledGame(installedGameList);
  // }, [router.query.id]);
  // const userId = router.query.id;
  // useEffect(() => {
  //   getGameInfoByUser();
  // }, [userId]);

  // const getGameInfoByUser = async () => {
  //   if (userId == 'string') {
  //     const res = await GameAPI.getGameInfoByUserAPI({ user_id: userId });
  //     const game_list = await res.data.game_list;
  //     setInstalledGameList(game_list);
  //   }
  // };
  //초기값(더미)으로 초기화되는 것을 막기 위함
  useEffect(() => {
    setGameOffsetList(gameOffsetList);
    setMapInfo(mapInfo);
  }, [mapInfo]);

  useEffect(() => {
    console.log('token here=========', token);
    dispatch(saveUserInfo.request(parseToken(token)));
    dispatch(getUserData.request({}));
  }, []);

  useEffect(() => {
    setInstalledGame(installedGame);
  }, [installedGame]);

  let nickname = '';
  friends.data.forEach((each) => {
    if (each.id == Number(router.query.id)) nickname = each.nickname;
    else nickname = userInfo.data.nickname;
  });
  return (
    <LibraryWrapper>
      {/* 지금 url에 있는 id 가져와서 유저 구매 게임 정보 및 정보들 가져와야함 */}
      {console.log(router.query.id)}
      {console.log(userInfo.data)}
      {console.log('mapInfo', mapInfo)}
      {console.log('gameInfoByUser', gameInfoByUser)}
      {console.log('gameOffsetList', gameOffsetList)}
      {console.log('installedGameList', gameInfoByUser.data)}
      {console.log('installedGame', installedGame)}
      {console.log('friends', friends.data)}

      <TitleWrapeer>
        <TitleStyle types="large">{`${nickname}의 라이브러리`}</TitleStyle>
        {console.log(friends)}
      </TitleWrapeer>
      <IconWrapper>
        <Text>{'내 캐릭터 '}</Text>
        <Image src={`${source[Math.floor(userInfo.data.idx % 10)]}`} width="50px" height="50px" />
      </IconWrapper>
      <LibraryContentWrapper>
        <NoSSRMap
          installedGame={installedGame}
          mapInfo={mapInfo}
          gameOffsetList={gameOffsetList}
          installedGameList={gameInfoByUser.data}
          setGameOffsetList={setGameOffsetList}
          userId={router.query.id}
        />
        <GameListLibrary
          purchaseList={userData.data.purchase_list}
          installedGameList={gameInfoByUser.data}
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
const TitleStyle = styled(Text)`
  display: block;
  margin-bottom: 0.5rem;
`;
const IconWrapper = styled.div`
  display: flex;
  margin-bottom: 2rem;
`;
export default library;
