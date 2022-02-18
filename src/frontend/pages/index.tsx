import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { NextPage } from 'next';
import styled from 'styled-components';

import { parseToken } from 'util/parseToken';
import { IState } from 'modules';
import { gameInfo } from 'modules/game';
import { saveUserInfo, SET_WEBSOCKET, SET_ONLINE } from 'modules/user';
import { getGameListAPI } from 'api/game/api';

import Text from 'components/atoms/Text';
import GameSlide from 'components/molecules/GameSlide';
import BigGameSlide from 'components/molecules/BigGameSlide';
import CarouselComponent from 'components/organisms/Carousel';
import BigCarouselComponent from 'components/organisms/BigCarousel';

const Main: NextPage = () => {
  const token = localStorage.getItem('accessToken');
  const friends = useSelector((state: IState) => state.user.friends.data);
  // let token: string | null;
  // const [token, setToken] = useState<string | null>();

  const [rankGames, setRankGames] = useState([] as gameInfo[]); // 다운로드 높은 게임들
  const [saleGames, setSaleGames] = useState([] as gameInfo[]); // 할인률 높은 게임들

  const getGames = async () => {
    setRankGames((await getGameListAPI('category=ALL&page=1&size=5&sort=download_count,desc')).data.game_list);
    setSaleGames((await getGameListAPI('category=ALL&page=1&size=5&sort=sale,desc')).data.game_list);
  };

  const dispatch = useDispatch();

  let ws = useRef<WebSocket>(); // 웹 소켓 사용

  useEffect(() => {
    // setToken(localStorage.getItem('accessToken'));
    const result = token && parseToken(token);

    dispatch(saveUserInfo.request(result));
  }, [token]);

  useEffect(() => {
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
              console.log(friends);
              let temp = [...friends];
              console.log(temp);
              console.log(temp.filter((f) => f.id.toString() === serverMessage.sender.id));
              temp.filter((f) => f.id.toString() === serverMessage.sender.id).forEach((f) => (f.status = true));
              console.log(temp);
              // dispatch({
              //   type: SET_FRIEND_STATUS,
              //   payload: Number(serverMessage.sender.id),
              // });
              break;
          }
        });
      };
    }
    //join 까지만?
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
              return <BigGameSlide key={data.id} {...data}></BigGameSlide>;
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
