import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import styled from 'styled-components';

interface IEachGameProps {
  installedGame: any;
  gameOffset: {
    x: number;
    y: number;
  };
  resetSelect: () => void;
  setGameOffset: ({ x, y }: any) => void;
  onChange: (e: any) => void;
}
const CloseBtn = styled.button`
  background-color: black;
  border-radius: 50%;
`;

const EachGame = (props: IEachGameProps) => {
  const { installedGame, resetSelect, gameOffset, setGameOffset } = props;
  // const [gameOffset, setGameOffset] = useState({ x: 0, y: 0 });
  const [isDraggable, setIsDraggable] = useState(true); // 설치 완료 버튼을 누르면 false로 설정, 기본값은 true

  // const { setGame1X, setGame1Y } = props.setGamePosFunc;
  // const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  // const ctx = canvas.getContext('2d');

  const GameImage = (x: any, y: any) => {
    const [image] = useImage(installedGame.image.main);

    return (
      <Image
        x={gameOffset.x}
        y={gameOffset.y}
        image={image}
        height={100}
        width={100}
        onDragEnd={(e) => {
          setGameOffset({ x: e.target.x(), y: e.target.y() });
          console.log(gameOffset, 'x', e.target.x(), 'y', e.target.y()); //setState()로 설정한 값과 차이가 생기는 이유는 console.log와 setState가 비동기적으로 실행되기 때문임
        }}
        draggable={isDraggable}
      />
    );
  };
  return <GameImage onClick={resetSelect} />;
};
export default EachGame;
