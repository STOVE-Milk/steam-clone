import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import styled from 'styled-components';

import useWindowSize from 'util/Hooks/useWindowDimensions';

import EachGame from 'components/organisms/EachGame';
import { commandType } from 'pages/library/[id]';
import { getItemFromLocalStorage } from 'util/getItemFromLocalStorage';
import { parseToken } from 'util/parseToken';
import UserObject from './UserObject';

const absoluteVal = 500;

const StageStyled = styled.div`
  height: ${absoluteVal}px;
  width: ${absoluteVal}px;

  background-image: linear-gradient(45deg, #754 25%, transparent 26%, transparent 75%, #754 75%, #754),
    linear-gradient(45deg, #754 25%, transparent 26%, transparent 75%, #754 75%, #754);
  background-size: calc(50px * 2) calc(50px * 2);
  background-position: 0 0, 50px 50px;
  margin: auto;
`;
interface IMapProps {
  installedGame: any;
}
interface IMoveProps {
  [index: string]: number;
}

const moveType: IMoveProps = {
  ArrowUp: 0,
  ArrowRight: 1,
  ArrowDown: 2,
  ArrowLeft: 3,
};

const Map = (props: IMapProps) => {
  const { installedGame, resetSelect } = props;

  const windowSize = useWindowSize();
  const width = windowSize.width;
  const height = windowSize.height;

  // const [userOffset, setUserOffset] = useState({x:250, y:250})
  const [userX, setUserX] = useState(250); //지금은 항상 가운데 나오게 설정된듯
  const [userY, setUserY] = useState(250);
  //TO DO: min, max를 줘서 넘어가면 min, max로 set되게 하면 밖으로 나가는거 해결할 수 있을듯? -> 렌더링은 일어나지만, 뷰적으로는 밖으로 나지 않게 설정함

  console.log('height', height);
  const [gameOffset, setGameOffset] = useState({ x: 0, y: 0 });

  // const [game1Y, setGame1Y] = useState(height - (height - 400));

  const shapeRef = React.useRef(null);

  const delta = 50;

  // 웹소켓 코드 시작
  const token = getItemFromLocalStorage('accessToken');

  const wsUri = `${process.env.NEXT_PUBLIC_BASE_URL_WS}`;

  let websocket: any;
  let output;
  let map;
  let textID: any;

  function onOpen(evt: any) {
    console.log('Connected to Endpoint!');
  }

  function onMessage(evt: any) {
    console.log(evt.data); // 이게 response data네 !
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
        let roomId = '1'; //테스트를 위해 1로 고정 -> navbar 친구기능 추가되면 옮기면 됨
        let access = {
          room_id: roomId, //누구의 library에 들어가는지
          authorization: token, //내가 누군지
        };
        console.log('websocket=======', websocket);
        const initData = sendData(commandType.INIT, access);
        console.log(initData);
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
  //소켓 코드 끝

  const focusRef = () => {
    focus();
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    console.log('A key was pressed', event.key);
    if (event.key === 'ArrowLeft') {
      setUserX((prev) => {
        prev = prev - delta;
        prev < 50 ? (prev = 50) : prev;
        return prev;
      });
    } else if (event.key === 'ArrowDown') {
      setUserY((prev) => {
        prev = prev + delta;
        prev > 450 ? (prev = 450) : prev;
        return prev;
      });
    } else if (event.key === 'ArrowUp') {
      setUserY((prev) => {
        prev = prev - delta;
        prev < 50 ? (prev = 50) : prev;

        return prev;
      });
    } else if (event.key === 'ArrowRight') {
      setUserX((prev) => {
        prev = prev + delta;
        prev > 450 ? (prev = 450) : prev;
        return prev;
      });
    }
    //업데이트된 위치를 보내야하는데 또 setState 비동기 문제 생길듯
    //방 끝으로 가면 direction으로 요청을 보내면 안됨
    sendData(commandType.MOVE, { direction: moveType[event.key] });
  };

  useEffect(() => {
    // console.log(shapeRef.current);
    window.addEventListener('keydown', handleKeyDown);

    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <StageStyled>
      {console.log(userX, userY)}
      <Stage
        id="canvas"
        width={absoluteVal}
        height={absoluteVal}
        ref={shapeRef}
        style={{ border: '1px solid black' }}
        onClick={focusRef}
      >
        <Layer>
          <Circle x={userX} y={userY} radius={50} width={absoluteVal / 10} fill="#989899" />
          {/* <UserObject x={userX} y={userY} width={absoluteVal / 5} /> */}
          {installedGame ? (
            <EachGame installedGame={installedGame} gameOffset={gameOffset} setGameOffset={setGameOffset} />
          ) : null}
        </Layer>
      </Stage>
    </StageStyled>
  );
};

export default Map;
