import { IAddGameOffsetToStore } from 'api/game/type';
import { useState } from 'react';

const delta = 50;
export const addGameOffsetToStore = async ({ prev, newGameOffset }: IAddGameOffsetToStore) => {
  //게임 좌표를 저장하는 로직
  const [gameObj, setGameObj] = useState(prev);

  for (let key in newGameOffset) {
    setGameObj((prev) => ({
      ...prev,
      [key]: {
        x: newGameOffset[key].x == 0 ? delta : newGameOffset[key].x + delta,
        y: newGameOffset[key].y == 0 ? delta : newGameOffset[key].y + delta,
      },
    }));
  }
  return { data: gameObj };
};
// x: gameObj[key].x == 0 ? delta : gameObj[key].x,
