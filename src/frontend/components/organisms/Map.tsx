import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import useWindowSize from 'util/Hooks/useWindowDimensions';
import { isEmpty } from 'util/isEmpty';
import { IState } from 'modules';

import Text from 'components/atoms/Text';
import Modal from 'components/atoms/Modal';
import EachGame from 'components/organisms/EachGame';
import { ModalConents } from 'components/molecules/ModalConents';
import { commandType, IMapInfo } from 'pages/library/[id]';
import { getItemFromLocalStorage } from 'util/getItemFromLocalStorage';
import UserObject from './UserObject';
import { colorPalette } from 'util/colorPalette';
import { gameInfo, addGameOffset } from 'modules/game';

import FilledButton from 'components/atoms/FilledButton';

const absoluteVal = 500;

interface IMapProps {
  installedGame: any;
  mapInfo: IMapInfo;
  gameOffsetList: {
    [index: number]: {
      x: number;
      y: number;
    };
  };
  installedGameList?: any;
  setGameOffsetList: (e: any) => void;
  userId: any; //serversideprops에서 오는 query에 있는 숫자
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

interface IUserInfo {
  [index: string]: {
    nickname: string;
    x: number;
    y: number;
  };
}

interface IGameInfo {
  [index: string]: {
    name: string;
    x: number;
    y: number;
  };
}

interface IGlobalState {
  room: {
    roomId: number;
    userCount?: number;
    users: {
      [idx: number]: { nickname: string; x: number; y: number };
    };
    map: {
      side: number;
      gameList: [];
      objectList: [];
      games: { [idx: number]: { name: string; x: number; y: number } };
      objects: {};
    };
  };
}
const Map = (props: IMapProps) => {
  const { installedGame, mapInfo, gameOffsetList, setGameOffsetList, installedGameList, userId } = props;
  const { userInfo } = useSelector((state: IState) => state.user);
  const { gameOffsetData } = useSelector((state: IState) => state.game);

  const dispatch = useDispatch();

  const windowSize = useWindowSize();
  const width = windowSize.width;
  const height = windowSize.height;
  const router = useRouter();

  // const [globalData, setGlobalData] = useState({} as IGlobalState);
  const [globalData, setGlobalData] = useState({
    //쌩 초기 더미값
    room: {
      roomId: `${router.query.id}`,
      userCount: 62,
      users: {
        // '59': { nickname: 'algorithm', x: 0, y: 0 },
        '52': { nickname: 'yasmin', x: 50, y: 50 },
      },
      map: {
        side: 20,
        gameList: [],
        objectList: [],
        games: {
          // '2': { name: 'PUBG: BATTLEGROUNDS', x: 196, y: 50 }
        },
        objects: {},
      },
    },
  });

  const offsetFunc = (offsetInfo: IGameInfo) => {
    dispatch(addGameOffset.request(offsetInfo));
  };

  // const [userLocation, setUserLocation] = useState({ 52: { x: 50, y: 50 }, 59: { x: 450, y: 450 } } as ILocationData); //나는 무조건 있고, 맵에서 유저를 받아와서 그 첫 정보를 넣을 수 있도록 해야됨
  const [userLocation, setUserLocation] = useState({ 52: { x: 50, y: 50 } } as ILocationData);

  const [user2Y, setUser2Y] = useState(50);
  //TO DO: min, max를 줘서 넘어가면 min, max로 set되게 하면 밖으로 나가는거 해결할 수 있을듯? -> 렌더링은 일어나지만, 뷰적으로는 밖으로 나지 않게 설정함

  // const [gameOffset, setGameOffsetList] = useState({ x: 0, y: 0 });

  // const [game1Y, setGame1Y] = useState(height - (height - 400));

  const shapeRef = React.useRef(null);

  const delta = 50;

  // 웹소켓 코드 시작
  const token = getItemFromLocalStorage('accessToken');

  const wsUri = `${process.env.NEXT_PUBLIC_BASE_URL_WS}`;
  let ws = useRef<WebSocket>();

  function onOpen(evt: any) {
    console.log('Connected to Endpoint!');
  }

  function disconnect() {
    if (!isEmpty(ws.current)) ws.current && ws.current.close();
  }

  // function send_message() {
  //   var message = textID.value;
  //   console.log('Message Sent: ' + message);
  //   ws.current&& ws.current.send(message);
  // }

  function onMessage(evt: any) {
    console.log(evt.data); // 이게 response data네 !
    //updateMap(JSON.parse(evt.data))
    const res = evt.data;
    const code = res.slice(0, 2);
    const data = JSON.parse(res.slice(2, res.length));
    if (code == '11') {
      //동기화 -> 1. 맨 처음 입장할 때
      setGlobalData(data);
      // 2. 맵에 게임이 설치될 때
      offsetFunc({ ...data.room.map.games });
    } else if (code == '20') {
      //다른유저 움직임
      handleMovement(data);
    } else if (code == '10') {
      //다른유저 방 입장
      setUserLocation((prev) => ({ ...prev, [data.user_id]: { x: 50, y: 50 } })); // 처음 들어오는 유저는 좌상단으로 입장
    } else if (code == '19') {
      alert(`${data.user_id}번 유저가 나갔습니다.`);
      //19{"user_id":"67"}
      //setUserLocation delete 그 유저 -> 잘 되는지 콘솔로 확인 해봐야함, 남아있는 듯
      setUserLocation((prev: any) => {
        for (let key in prev) {
          const state = prev;
          console.log(key, data.user_id);
          delete state.data.user_id;
          return { ...state };
        }
        // if (!isEmpty(ws.current)) ws.current && ws.current.close();
      });
    }
  }

  function onError(evt: any) {
    console.log('ERROR: ' + evt.data);
  }

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
        const roomId = userId;
        let access = {
          room_id: userId, //누구의 library에 들어가는지
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
  }, [userId]);
  // useEffect(() => {
  //   disconnect();
  //   connect();
  // }, [userId]);
  //소켓 코드 끝

  const focusRef = () => {
    focus();
  };
  const handleMovement = (data: { user_id: number; direction: number }) => {
    console.log('where is he going? ', data.direction);
    if (data.direction == 0) {
      setUserLocation((prev) => ({
        ...prev,
        [data.user_id]: {
          x: prev[data.user_id].x,
          y: prev[data.user_id].y - delta < 50 ? 50 : prev[data.user_id].y - delta,
        },
      }));
    } else if (data.direction == 1) {
      setUserLocation((prev) => ({
        ...prev,
        [data.user_id]: {
          x: prev[data.user_id].x + delta > 450 ? 450 : prev[data.user_id].x + delta,
          y: prev[data.user_id].y,
        },
      }));
    } else if (data.direction == 2) {
      setUserLocation((prev) => ({
        ...prev,
        [data.user_id]: {
          x: prev[data.user_id].x,
          y: prev[data.user_id].y + delta > 450 ? 450 : prev[data.user_id].y + delta,
        },
      }));
    } else if (data.direction == 3) {
      setUserLocation((prev) => ({
        ...prev,
        [data.user_id]: {
          x: prev[data.user_id].x - delta < 50 ? 50 : prev[data.user_id].x - delta,
          y: prev[data.user_id].y,
        },
      }));
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    console.log('A key was pressed', event.key);
    // 유저의 id를 넣어줘야하는데, 어떻게 고정값을 넣을것인가

    if (event.key === 'ArrowUp') {
      setUserLocation((prev) => ({
        ...prev,
        [userInfo.data.idx]: {
          x: prev[userInfo.data.idx].x,
          y: prev[userInfo.data.idx].y - delta < 50 ? 50 : prev[userInfo.data.idx].y - delta,
        },
      }));
    } else if (event.key === 'ArrowRight') {
      setUserLocation((prev) => ({
        ...prev,
        [userInfo.data.idx]: {
          x: prev[userInfo.data.idx].x + delta > 450 ? 450 : prev[userInfo.data.idx].x + delta,
          y: prev[userInfo.data.idx].y,
        },
      }));
    } else if (event.key === 'ArrowDown') {
      setUserLocation((prev) => ({
        ...prev,
        [userInfo.data.idx]: {
          x: prev[userInfo.data.idx].x,
          y: prev[userInfo.data.idx].y + delta > 450 ? 450 : prev[userInfo.data.idx].y + delta,
        },
      }));
    } else if (event.key === 'ArrowLeft') {
      setUserLocation((prev) => ({
        ...prev,
        [userInfo.data.idx]: {
          x: prev[userInfo.data.idx].x - delta < 50 ? 50 : prev[userInfo.data.idx].x - delta,
          y: prev[userInfo.data.idx].y,
        },
      }));
    }
    //업데이트된 위치를 보내야하는데 또 setState 비동기 문제 생길듯
    //방 끝으로 가면 direction으로 요청을 보내면 안됨
    sendData(commandType.MOVE, { direction: moveType[event.key] });
  };
  const handleBuildEvt = () => {
    sendData(commandType.BUILD, { map: mapInfo });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    document.querySelector('#btn') && document.querySelector('#btn')!.addEventListener('click', handleBuildEvt);
    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const userObjects = (userLocation: ILocationData) => {
    let userArr: number[] = [];
    for (let key in userLocation) {
      if (userLocation.hasOwnProperty(key)) {
        userArr.push(Number(key));
      }
    }
    return userArr;
  };

  //전체정보에서 유저정보 갱신
  useEffect(() => {
    //현재 있는 나의 유저 정보 prev에서 갱신해야됨 globalData 로 위치 주기
    const userObj: IUserInfo = globalData.room.users;
    for (let key in userObj) {
      setUserLocation((prev) => ({
        ...prev,
        [key]: {
          nickname: userObj[key].nickname,
          x: userObj[key].x == 0 ? delta : userObj[key].x * delta + delta,
          y: userObj[key].y == 0 ? delta : userObj[key].y * delta + delta,
        },
      }));
    }
  }, [globalData.room.users]);

  //전체정보에서 game 정보 갱신
  useEffect(() => {
    //현재 있는 나의 게임 정보 prev에서 갱신해야됨 globalData 로 위치 주기
    const gameObj: IGameInfo = globalData.room.map.games;
    for (let key in gameObj) {
      setGameOffsetList((prev: any) => ({
        ...prev,
        [key]: {
          name: gameObj[key].name,
          x: gameObj[key].x == 0 ? delta : gameObj[key].x,
          y: gameObj[key].y == 0 ? delta : gameObj[key].y,
        },
      }));
    }
  }, [globalData.room.map.games]);

  useEffect(() => {
    setGlobalData(globalData);
  }, []);

  const me = userId == userInfo.data.idx.toString();

  // x좌표를 찾을 수 없다는 에러 떠서 일단 주석처리 -> 게임에 접근시 모달 띄우는 코드
  useEffect(() => {
    enterChecker();
  }, [userLocation]);

  const [enteredGame, setEnteredGame] = useState({} as gameInfo);
  const enterChecker = () => {
    for (let key in gameOffsetList) {
      if (
        userLocation &&
        userLocation[userId].x === gameOffsetList[key].x &&
        userLocation[userId].y === gameOffsetList[key].y
      ) {
        installedGameList.map((each: any) => {
          if (each.id == key) {
            setEnteredGame(each);
            setShowModal(true);
            console.log(each);
          }
        });
      }
    }
  };
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <SubTitleStyle>{'마이 홈'}</SubTitleStyle>
      <Modal onClose={() => setShowModal(false)} show={showModal} height="200px">
        <ModalConents title={enteredGame.name} description={enteredGame.description_snippet}></ModalConents>
      </Modal>
      <StageStyled me={me}>
        {/* {console.log('mapInfo from library', mapInfo)} */}
        {console.log('global data', globalData)}
        {console.log('userLocation', userLocation)}
        {console.log('gameOffsetData', gameOffsetData.data)}
        {console.log('userId', userId)}
        <Stage id="canvas" width={absoluteVal} height={absoluteVal} ref={shapeRef} style={{}} onClick={focusRef}>
          <Layer>
            {userObjects(userLocation).map((eachUser, i) => {
              if (eachUser == userInfo.data.idx) {
                //나
                return (
                  <UserObject
                    x={userLocation[userInfo.data.idx].x}
                    y={userLocation[userInfo.data.idx].y}
                    width={absoluteVal / 10}
                    idx={userInfo.data.idx}
                  />
                );
              } else {
                return (
                  <UserObject
                    x={userLocation[eachUser].x}
                    y={userLocation[eachUser].y}
                    width={absoluteVal / 10}
                    idx={eachUser}
                  />
                );
              }
            })}
            {console.log(installedGame, installedGameList)}

            {installedGameList &&
              installedGameList.map((eachGame: gameInfo) => {
                return (
                  <EachGame
                    installedGame={eachGame} //game_id받아와서 넣어야함, idx가 그것인것
                    mapInfo={mapInfo}
                    gameOffsetList={gameOffsetList}
                    setGameOffsetList={setGameOffsetList}
                    curSelectedGameId={!isEmpty(installedGame) ? installedGame.id : 0}
                  />
                );
              })}
          </Layer>
        </Stage>
        {userId == userInfo.data.idx.toString() && (
          <BtnWrapper>
            <StyledBtn
              id="btn"
              onClick={() => {
                handleBuildEvt();
              }}
            >
              마이 홈 정보 저장하기
            </StyledBtn>
          </BtnWrapper>
        )}
      </StageStyled>
    </div>
  );
};

const SubTitleStyle = styled(Text)`
  margin-bottom: 1rem;
`;

const BtnWrapper = styled.div`
  display: flex;
`;
const StyledBtn = styled.button`
  background: ${(props) => props.theme.colors['secondaryBgBg']};
  font-size: 1em;
  cursor: pointer;
  margin: 0 1rem;
  padding: 0.25rem 1rem;
  border: 1px solid ${(props) => props.theme.colors['secondaryBg']};
  border-radius: 10px;
  height: 50px;
  width: 100%;
  white-space: nowrap;
  margin-top: 1rem;
`;
const StageStyled = styled.div<{ me: boolean }>`
  ${(props) =>
    !props.me && {
      'pointer-events': 'none',
    }}
  height: ${absoluteVal}px;
  width: ${absoluteVal}px;

  /* background-image: url("../../public/grass.jpg"); */
  background-image: linear-gradient(45deg, #754 25%, transparent 26%, transparent 75%, #754 75%, #754),
    linear-gradient(45deg, #754 25%, transparent 26%, transparent 75%, #754 75%, #754);
  background-size: calc(50px * 2) calc(50px * 2);
  background-position: 0 0, 50px 50px;
  margin: auto;
`;

export default Map;
