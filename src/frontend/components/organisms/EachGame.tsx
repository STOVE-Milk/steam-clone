import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import styled from 'styled-components';

interface IEachGameProps {
  installedGame: any;
  gameOffsetList: {
    x: number;
    y: number;
  };
  setGameOffsetList: ({ x, y }: any) => void;
}
const CloseBtn = styled.button`
  background-color: black;
  border-radius: 50%;
`;

const EachGame = (props: IEachGameProps) => {
  const { installedGame, gameOffsetList, setGameOffsetList } = props;
  // const [gameOffset, setGameOffset] = useState({ x: 0, y: 0 });
  const [isDraggable, setIsDraggable] = useState(true); // 설치 완료 버튼을 누르면 false로 설정, 기본값은 true

  // const { setGame1X, setGame1Y } = props.setGamePosFunc;
  // const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  // const ctx = canvas.getContext('2d');

  const GameImage = (x: any, y: any) => {
    const [image] = useImage(installedGame.image.main);

    return (
      <Image
        x={gameOffsetList.x}
        y={gameOffsetList.y}
        image={image}
        height={100}
        width={100}
        onDragEnd={(e) => {
          setGameOffsetList({ x: e.target.x(), y: e.target.y() });
          console.log(gameOffsetList, 'x', e.target.x(), 'y', e.target.y()); // 직접 이벤트에서 뽑아온 gameOffset값과 setState()로 설정한 값과 차이가 생기는 이유는 console.log(먼저)와 setState(나중)가 비동기적으로 실행되기 때문임
        }}
        draggable={isDraggable}
      />
    );
  };
  return <GameImage />;
};
export default React.memo(EachGame);
