import React, { useEffect, useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import styled from 'styled-components';
import { Html } from 'react-konva-utils';

interface IEachGameProps {
  installedGame: any;
  position: {
    x: number;
    y: number;
  };
  resetSelect: () => void;
  // setGamePosFunc: {
  //   setGame1X: (x: number) => void;
  //   setGame1Y: (x: number) => void;
  // };
  onChange: (e: any) => void;
}
const CloseBtn = styled.button`
  background-color: black;
  border-radius: 50%;
`;

const EachGame = (props: IEachGameProps) => {
  const { installedGame, resetSelect, onChange } = props;
  let { x, y } = props.position;
  // const { setGame1X, setGame1Y } = props.setGamePosFunc;
  // const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  // const ctx = canvas.getContext('2d');

  console.log('게임좌표', x, y);
  const GameImage = (x: any, y: any) => {
    const [image] = useImage(installedGame.image.main);

    return <Image image={image} height={100} width={100} draggable />;
  };
  return <GameImage x={x} y={y} onClick={resetSelect} />;
};
export default EachGame;
