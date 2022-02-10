import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle } from 'react-konva';
import styled from 'styled-components';

import useWindowSize from 'util/Hooks/useWindowDimensions';

import EachGame from 'components/organisms/EachGame';

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
{
  /* <img alt="lion" src="https://konvajs.org/assets/lion.png" draggable="true" /> */
}
interface IMapProps {
  installedGame: any;
  resetSelect: () => void;
}

const Map = (props: IMapProps) => {
  const { installedGame, resetSelect } = props;

  const windowSize = useWindowSize();
  const width = windowSize.width;
  const height = windowSize.height;

  const [userX, setUserX] = useState(250); //지금은 항상 가운데 나오게 설정된듯
  const [userY, setUserY] = useState(250);
  //TO DO: min, max를 줘서 넘어가면 min, max로 set되게 하면 밖으로 나가는거 해결할 수 있을듯? -> 렌더링은 일어나지만, 뷰적으로는 밖으로 나지 않게 설정함

  console.log(height);
  const [game1X, setGame1X] = useState(20);
  const [game1Y, setGame1Y] = useState(height - (height - 400));

  const shapeRef = React.useRef(null);

  const delta = 50;

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
  };

  useEffect(() => {
    console.log(shapeRef.current);
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
        width={absoluteVal}
        height={absoluteVal}
        ref={shapeRef}
        style={{ border: '1px solid black' }}
        onClick={focusRef}
      >
        <Layer>
          <Circle x={userX} y={userY} radius={50} width={absoluteVal / 5} fill="#989899" />
          {installedGame ? (
            <EachGame resetSelect={resetSelect} installedGame={installedGame} position={{ x: game1X, y: game1Y }} />
          ) : null}
        </Layer>
      </Stage>
    </StageStyled>
  );
};

export default Map;
