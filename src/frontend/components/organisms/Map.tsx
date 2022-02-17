import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import useWindowSize from 'util/Hooks/useWindowDimensions';

import EachGame from 'components/organisms/EachGame';
import { commandType, IMapInfo } from 'pages/library/[id]';
import { getItemFromLocalStorage } from 'util/getItemFromLocalStorage';
import UserObject from './UserObject';

const absoluteVal = 500;

interface IMapProps {
  installedGame: any;
  mapInfo: IMapInfo;
  gameOffset: {
    x: number;
    y: number;
  };
  setGameOffset: (e: any) => void;
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
interface ILocationData {
  [id: number]: {
    x: number;
    y: number;
  };
}

const Map = (props: IMapProps) => {
  const { installedGame, mapInfo, gameOffset, setGameOffset } = props;

  const windowSize = useWindowSize();
  const width = windowSize.width;
  const height = windowSize.height;

  const [globalData, setGlobalData] = useState();

  // const [userOffset, setUserOffset] = useState({x:250, y:250})
  const [userX, setUserX] = useState(250); //지금은 항상 가운데 나오게 설정된듯
  const [userY, setUserY] = useState(250);

  const [userLocation, setUserLocation] = useState({ 52: { x: 50, y: 50 }, 59: { x: 450, y: 450 } } as ILocationData); //지금은 항상 가운데 나오게 설정된듯

  const [moveEvent, setMoveEvent] = useState();

  const [user2Y, setUser2Y] = useState(50);
  //TO DO: min, max를 줘서 넘어가면 min, max로 set되게 하면 밖으로 나가는거 해결할 수 있을듯? -> 렌더링은 일어나지만, 뷰적으로는 밖으로 나지 않게 설정함
  const router = useRouter();

  // const [gameOffset, setGameOffset] = useState({ x: 0, y: 0 });

  // const [game1Y, setGame1Y] = useState(height - (height - 400));

  const shapeRef = React.useRef(null);

  const delta = 50;

  // 웹소켓 코드 시작
  const token = getItemFromLocalStorage('accessToken');

  const wsUri = `${process.env.NEXT_PUBLIC_BASE_URL_WS}`;
  let ws = useRef<WebSocket>(); // 웹 소켓 사용

  function onOpen(evt: any) {
    console.log('Connected to Endpoint!');
  }

  function onMessage(evt: any) {
    console.log(evt.data); // 이게 response data네 !
    //updateMap(JSON.parse(evt.data))
    const res = evt.data;
    const data = JSON.parse(res.slice(2, res.length));
    if (res.slice(0, 2) == '11') {
      setGlobalData(data);
    } else if (res.slice(0, 2) == '20') {
      if (data.direction == 0) {
        setUserLocation((prev) => ({
          ...prev,
          [data.user_id]: { x: prev[data.user_id].x, y: prev[data.user_id].y - delta },
        }));
      } else if (data.direction == 1) {
        setUserLocation((prev) => ({
          ...prev,
          [data.user_id]: { x: prev[data.user_id].x + delta, y: prev[data.user_id].y },
        }));
      } else if (data.direction == 2) {
        setUserLocation((prev) => ({
          ...prev,
          [data.user_id]: { x: prev[data.user_id].x, y: prev[data.user_id].y + delta },
        }));
      } else if (data.direction == 3) {
        setUserLocation((prev) => ({
          ...prev,
          [data.user_id]: { x: prev[data.user_id].x - delta, y: prev[data.user_id].y },
        }));
      }
    }
  }

  function onError(evt: any) {
    console.log('ERROR: ' + evt.data);
  }
  // function disconnect() {
  //   if (!ws.current) ws.current.close();
  // }

  // function send_message() {
  //   var message = textID.value;
  //   console.log('Message Sent: ' + message);
  //   ws.current.send(message);
  // }

  function sendData(command: number, data: any) {
    console.log('SEND DATA', data);
    ws.current && ws.current.send(command + JSON.stringify(data));
  }

  function connect() {
    if (!ws.current) {
      ws.current = new WebSocket(wsUri);
      ws.current.onopen = function (evt: any) {
        onOpen(evt);
        console.log('서버와 웹 소켓 연결됨');
        // let roomId = `${router.query.id}`; //테스트를 위해 1로 고정 -> navbar 친구기능 추가되면 옮기면 됨
        const roomId = 52;
        let access = {
          room_id: roomId, //누구의 library에 들어가는지
          authorization: token, //내가 누군지
        };
        console.log('ws.current=======', ws.current);
        sendData(commandType.INIT, access);
      };
      ws.current.onmessage = function (evt: any) {
        onMessage(evt); // 20{"user_id":"59","direction":0}
      };
      ws.current.onerror = function (evt: any) {
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
  // const handleMovement = (direction: number) => {
  //   console.log('where is he going? ', direction);
  //   if (direction == 0) {
  //     return {x: }
  //   } else if (direction == 1) {

  //   } else if (direction == 2) {
  //     setUserY((prev) => {
  //       prev = prev - delta;
  //       prev < 50 ? (prev = 50) : prev;

  //       return prev;
  //     });
  //   } else if (direction == 3) {
  //     setUserX((prev) => {
  //       prev = prev + delta;
  //       prev > 450 ? (prev = 450) : prev;
  //       return prev;
  //     });
  //   }

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
  const handleBuildEvt = () => {
    sendData(commandType.BUILD, { map: mapInfo });
  };

  useEffect(() => {
    // console.log(shapeRef.current);
    window.addEventListener('keydown', handleKeyDown);
    // window.addEventListener('keydown', handle2ndKeyDown);

    document.querySelector('#btn') && document.querySelector('#btn')!.addEventListener('click', handleBuildEvt);
    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // window.addEventListener('keydown', handle2ndKeyDown);

      // document.querySelector('#btn') && document.querySelector('#btn')!.removeEventListener('click', handleBuildEvt);
    };
  }, []);

  // useEffect(() => {
  //   set
  // }, []);
  return (
    <StageStyled>
      {console.log(userX, userY)}
      {console.log('mapInfo from library', mapInfo)}
      {console.log('global data', globalData)}
      {/* {console.log('movement', moveEvent)} */}
      {console.log('userLocation', userLocation)}

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
          {/* // 20{"user_id":"59","direction":0} */}
          <Circle
            x={userLocation['52'].x}
            y={userLocation['52'].y}
            radius={50}
            width={absoluteVal / 10}
            fill="#934749"
          />
          <Circle
            x={userLocation['59'].x}
            y={userLocation['59'].y}
            radius={50}
            width={absoluteVal / 10}
            fill="#313bc9"
          />

          {/* <UserObject x={userX} y={userY} width={absoluteVal / 5} /> */}
          {installedGame ? (
            <EachGame installedGame={installedGame} gameOffset={gameOffset} setGameOffset={setGameOffset} />
          ) : null}
        </Layer>
      </Stage>
      <button
        id="btn"
        onClick={() => {
          handleBuildEvt();
        }}
      >
        게임 좌표 저장하기
      </button>
    </StageStyled>
  );
};

const StageStyled = styled.div`
  height: ${absoluteVal}px;
  width: ${absoluteVal}px;

  background-image: linear-gradient(45deg, #754 25%, transparent 26%, transparent 75%, #754 75%, #754),
    linear-gradient(45deg, #754 25%, transparent 26%, transparent 75%, #754 75%, #754);
  background-size: calc(50px * 2) calc(50px * 2);
  background-position: 0 0, 50px 50px;
  margin: auto;
`;

export default Map;
