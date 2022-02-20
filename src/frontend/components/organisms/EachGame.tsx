import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import styled from 'styled-components';
import { IMapInfo } from 'pages/library/[id]';

import { isEmpty } from 'util/isEmpty';

interface IEachGameProps {
  installedGame: any;
  gameOffsetList: {
    [index: number]: {
      x: number;
      y: number;
    };
  };
  setGameOffsetList: ({ x, y }: any) => void;
  mapInfo: IMapInfo;
  curSelectedGameId?: number;
}
const CloseBtn = styled.button`
  background-color: black;
  border-radius: 50%;
`;

const EachGame = (props: IEachGameProps) => {
  const { installedGame, gameOffsetList, setGameOffsetList, mapInfo, curSelectedGameId } = props;
  // const [gameOffset, setGameOffset] = useState({ x: 0, y: 0 });
  const [isDraggable, setIsDraggable] = useState(true); // 설치 완료 버튼을 누르면 false로 설정, 기본값은 true

  // const { setGame1X, setGame1Y } = props.setGamePosFunc;
  // const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  // const ctx = canvas.getContext('2d');

  const GameImage = (x: any, y: any) => {
    const [image] = useImage(installedGame.image.main);
    console.log('gameOffsetList', gameOffsetList);
    console.log('installedGame in eachGame', installedGame);

    const delta = 50;
    return isEmpty(gameOffsetList[installedGame.id]) ? (
      //클릭하면 등장하게
      curSelectedGameId == installedGame.id.toString() ? (
        <Image
          x={50}
          y={50}
          image={image}
          height={100}
          width={100}
          onDragEnd={(e) => {
            setGameOffsetList((prev: any) => ({
              ...prev,
              [installedGame.id]: {
                x: Math.round(e.target.x() / delta) * delta,
                y: Math.round(e.target.y() / delta) * delta,
              },
            }));
            console.log(gameOffsetList, 'x', e.target.x(), 'y', e.target.y()); // 직접 이벤트에서 뽑아온 gameOffset값과 setState()로 설정한 값과 차이가 생기는 이유는 console.log(먼저)와 setState(나중)가 비동기적으로 실행되기 때문임
          }}
          draggable={isDraggable}
        />
      ) : (
        <></>
      )
    ) : (
      <Image
        x={gameOffsetList[installedGame.id].x}
        y={gameOffsetList[installedGame.id].y}
        image={image}
        height={100}
        width={100}
        onDragEnd={(e) => {
          setGameOffsetList((prev: any) => ({
            ...prev,
            [installedGame.id]: { name: installedGame[installedGame.id].name, x: e.target.x(), y: e.target.y() },
          }));
          console.log(gameOffsetList, 'x', e.target.x(), 'y', e.target.y()); // 직접 이벤트에서 뽑아온 gameOffset값과 setState()로 설정한 값과 차이가 생기는 이유는 console.log(먼저)와 setState(나중)가 비동기적으로 실행되기 때문임
        }}
        draggable={isDraggable}
      />
    );
  };
  return <GameImage />;
};
export default React.memo(EachGame);
