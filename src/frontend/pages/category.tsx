import React from 'react';
import GameInfo from 'components/organisms/GameInfo';
// import IGameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';
import IGameInfo from 'pages/category';

export type GameMedia = {
  main: string;
  sub: Array<string>;
};

export type GamePrice = {
  region: number;
};
export interface IGameInfo {
  name: string;
  os: Array<string>; // 지원 가능한 os 가 모두 다 오는 식
  gameCategory: Array<string>;
  price: any;
  image: GameMedia;
  video: GameMedia;
  category_list: Array<string>;
}

const mockData: Array<IGameInfo> = [
  {
    name: 'Vampire Survivors',
    os: ['windows', 'apple'],
    gameCategory: ['Action', 'Roguelite', 'Pixel Graphics', 'Unforgiving'],
    price: {
      kr: 10000,
    },
    image: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
    video: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
    category_list: ['Action', 'Roguelite', 'Pixel Graphics', 'Unforgiving'],
  },
  {
    name: 'Vampire Survivors2',
    os: ['windows'],
    gameCategory: ['Action', 'Roguelite', 'Pixel Graphics', 'Unforgiving'],
    price: {
      kr: 10000,
    },
    image: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
    video: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
    category_list: ['Action', 'Roguelite', 'Pixel Graphics', 'Unforgiving'],
  },
];

const Category = () => {
  return (
    <div>
      <Text types="large">카테고리 페이지 게임 리스트</Text>
      {mockData.map((eachGame, i) => {
        return <GameInfo key={i} {...eachGame} />;
      })}
    </div>
  );
};

export default Category;
