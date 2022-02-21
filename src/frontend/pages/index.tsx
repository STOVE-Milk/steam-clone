import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { NextPage } from 'next';
import styled from 'styled-components';

import { parseToken } from 'util/parseToken';
import { IState } from 'modules';
import { gameInfo } from 'modules/game';
import { saveUserInfo, SET_WEBSOCKET, SET_ONLINE, SET_OFFLINE } from 'modules/user';
import { getGameListAPI } from 'api/game/api';

import Text from 'components/atoms/Text';
import GameSlide from 'components/molecules/GameSlide';
import BigGameSlide from 'components/molecules/BigGameSlide';
import CarouselComponent from 'components/organisms/Carousel';
import BigCarouselComponent from 'components/organisms/BigCarousel';

const Main: NextPage<IState> = () => {
  const [rankGames, setRankGames] = useState([] as gameInfo[]); // 다운로드 높은 게임들
  const [saleGames, setSaleGames] = useState([] as gameInfo[]); // 할인률 높은 게임들

  const getGames = async () => {
    setRankGames((await getGameListAPI('category=ALL&page=1&size=5&sort=download_count,desc')).data.game_list);
    setSaleGames((await getGameListAPI('category=ALL&page=1&size=5&sort=sale,desc')).data.game_list);
  };

  const dispatch = useDispatch();

  let ws = useRef<WebSocket>(); // 웹 소켓 사용

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const result = token && parseToken(token);

    dispatch(saveUserInfo.request(result));

    if (!ws.current) {
      const websocket = new WebSocket(`ws://fortice.iptime.org:8080/chat/ws?token=${token}`); //웹 소켓 연결
      ws.current = websocket;
      dispatch({
        type: SET_WEBSOCKET,
        payload: websocket,
      });
      // 서버 -> 클라이언트
      ws.current.onmessage = (e: MessageEvent) => {
        const events = e.data.split('\n');
        events.forEach((event: string) => {
          const serverMessage = JSON.parse(event);
          switch (serverMessage.action) {
            case 'user-join': // 유저 접속
              console.log('user-join', serverMessage.sender);
              dispatch({
                type: SET_ONLINE,
                payload: Number(serverMessage.sender.id),
              });
              break;
            case 'user-left': // 유저 활동 종료
              console.log('user-left', serverMessage);
              dispatch({
                type: SET_OFFLINE,
                payload: Number(serverMessage.sender.id),
              });
              break;
          }
        });
      };
    }
  }, []);

  useEffect(() => {
    getGames();
  }, []);

  return (
    <MainWrapper>
      <CarouselSection>
        <Title types={'large'}>인기 게임</Title>
        <CarouselBox>
          <BigCarouselComponent
            slides={rankGames.map((data) => {
              return <BigGameSlide key={data.id} id={data.id} src={data.image.main}></BigGameSlide>;
            })}
          ></BigCarouselComponent>
        </CarouselBox>
        <Title types={'large'}>할인중인 게임</Title>
        <CarouselBox>
          <CarouselComponent
            slides={saleGames.map((data) => {
              return <GameSlide key={data.id} {...data}></GameSlide>;
            })}
          ></CarouselComponent>
        </CarouselBox>
      </CarouselSection>
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const Title = styled(Text)`
  margin: 3rem 0 0 3rem;
`;

const CarouselSection = styled.div`
  width: calc(100vw - 250px);
`;

const CarouselBox = styled.div`
  margin: 3rem 0;
`;

export default Main;
