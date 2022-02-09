import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle } from 'react-konva';

const Map = () => {
  const [x, setX] = useState(250);
  const [y, setY] = useState(250);

  const shapeRef = React.useRef(null);

  const delta = 50;

  const focusRef = () => {
    focus();
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    console.log('A key was pressed', event.keyCode);
    if (event.keyCode === 37) {
      setX((prev) => {
        prev = prev - delta;
        return prev;
      });
    } else if (event.keyCode === 40) {
      setY((prev) => {
        prev = prev + delta;
        return prev;
      });
    } else if (event.keyCode === 38) {
      setY((prev) => {
        prev = prev - delta;
        return prev;
      });
    } else if (event.keyCode === 39) {
      setX((prev) => {
        prev = prev + delta;
        return prev;
      });
    }
    console.log(x, y);
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
    <Stage width={1000} height={500} ref={shapeRef} style={{ border: '1px solid black' }} onClick={focusRef}>
      <Layer>
        <Circle x={x} y={y} radius={50} fill="green" />
      </Layer>
    </Stage>
  );
};

export default Map;
