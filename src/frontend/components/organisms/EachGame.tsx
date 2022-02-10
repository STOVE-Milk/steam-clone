import React, { useState } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

interface IEachGameProps {
  installedGame: any;
  position: {
    x: number;
    y: number;
  };
  resetSelect: () => void;
}
const EachGame = (props: IEachGameProps) => {
  const { installedGame, resetSelect } = props;
  let { x, y } = props.position;

  console.log(x, y);
  const LionImage = (x: any, y: any) => {
    const [image] = useImage(
      'https://cdn.akamai.steamstatic.com/steam/apps/1446780/ss_f8249da14987e3c2d10fd4024736f28774c713da.600x338.jpg?t=1642121078',
    );
    return <Image image={image} height={100} width={100} draggable />;
  };
  return (
    <div onClick={resetSelect}>
      <LionImage x={x} y={y} />
    </div>
  );
};
export default EachGame;
