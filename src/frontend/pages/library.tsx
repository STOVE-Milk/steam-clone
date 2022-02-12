import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
const userList = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImV4cCI6MTIwMDAwMDAwMH0.eyJpZHgiOjEsIm5pY2tuYW1lIjoidGVzdCIsInJvbGUiOjEsImNvdW50cnkiOiJLUiJ9.6P_NJvZhGGc4XAdVlm74rgIVIzPtXZbChaZCqBbUba4',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImV4cCI6MTIwMDAwMDAwMH0.eyJpZHgiOjIsIm5pY2tuYW1lIjoidGVzdCIsInJvbGUiOjEsImNvdW50cnkiOiJLUiJ9._mgKj7UC9YMk2Q5nq2PgX33rzDOhI0sF12X9Z4Q5Xn4',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImV4cCI6MTIwMDAwMDAwMH0.eyJpZHgiOjMsIm5pY2tuYW1lIjoidGVzdCIsInJvbGUiOjEsImNvdW50cnkiOiJLUiJ9.8oLvc4rLDf84plkuWEnxcJrrXonxrMrF0uTWrCMNfIY',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImV4cCI6MTIwMDAwMDAwMH0.eyJpZHgiOjQsIm5pY2tuYW1lIjoidGVzdCIsInJvbGUiOjEsImNvdW50cnkiOiJLUiJ9.-HJMms8T0L5rVUmPZnui12p3IunPeq2Hnv70Vbr9G6E',
];

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

  const onSelect = (installedGame: any) => {
    console.log(installedGame);
    setInstalledGame(installedGame);
  };
  const resetSelect = () => {
    setInstalledGame(null);
  };

  // let token;
  // if (typeof window !== 'undefined') {
  //   token = localStorage.getItem('accessToken');
  // }
  // const apiCall = `10{
  //     "authorization": ${token},
  //     "room_id": ${'1'},
  //   }`;
  const wsUri = 'ws://localhost:8210/library';
  let websocket: any;
  let output;
  let map;
  let textID: any;

  function onOpen(evt: any) {
    console.log('Connected to Endpoint!');
  }

  function onMessage(evt: any) {
    console.log(evt.data);
    //updateMap(JSON.parse(evt.data))
  }

  function onError(evt: any) {
    console.log('ERROR: ' + evt.data);
  }
  function disconnect() {
    if (!websocket) websocket.close();
  }

  function send_message() {
    var message = textID.value;
    console.log('Message Sent: ' + message);
    websocket.send(message);
  }

  function sendData(command: number, data: any) {
    console.log('SEND DATA', data);
    websocket.send(command + JSON.stringify(data));
  }

  function connect() {
    if (!websocket) {
      websocket = new WebSocket(wsUri);
      websocket.onopen = function (evt: any) {
        onOpen(evt);
        console.log('서버와 웹 소켓 연결됨');
        var roomId = '1'; //테스트를 위해 1로 고정
        var token = userList[0];
        let access = {
          room_id: roomId, //누구의 library에 들어가는지
          authorization: token, //내가 누군지
        };
        sendData(commandType.INIT, access);
      };
      websocket.onmessage = function (evt: any) {
        onMessage(evt);
      };
      websocket.onerror = function (evt: any) {
        onError(evt);
      };
    }
  }
  useEffect(() => {
    connect();
  }, []);
  return (
    <LibraryWrapper>
      {console.log(userInfo.data)}
      <TitleStyle types="large">{`${userInfo.data.nickname}의 라이브러리(구매 게임 목록)`}</TitleStyle>
      <LibraryContentWrapper>
        <NoSSRMap installedGame={installedGame} resetSelect={resetSelect} sendData={sendData} />
        <GameListLibrary onSelect={onSelect} sendData={sendData} />
        {/* <button onClick={() => setCount(count + 1)}>add user</button> */}
      </LibraryContentWrapper>
    </LibraryWrapper>
  );
};

export default library;
