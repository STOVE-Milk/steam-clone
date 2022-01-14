import React from 'react';
import GameInfo from 'components/organisms/GameInfo';
// import IGameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';
import IGameInfo from 'pages/category';
import styled from 'styled-components';
import CategoryList from 'components/molecules/CategoryList';

export type GameMedia = {
  main: string;
  sub: Array<string>;
};

export type GamePrice = {
  region: number;
};
export interface IGameInfo {
  id: number;
  name: string;
  os: Array<string>; // 지원 가능한 os 가 모두 다 오는 식
  description_snippet: string;
  price: any;
  sale: number;
  image: GameMedia;
  video: GameMedia;
  category_list: Array<string>;
}

const mockData: Array<IGameInfo> = [
  {
    id: 1,
    name: 'Vampire Survivors',
    os: ['windows', 'apple'],
    description_snippet:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.za',
    price: {
      kr: 10000,
    },
    sale: 10,
    image: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
    video: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
    category_list: ['Sandbox', 'RTS', 'FPS', 'MOBA'],
  },
  {
    id: 2,
    name: 'Vampire Survivors2',
    os: ['windows'],
    description_snippet:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.za',
    price: {
      kr: 10000,
    },
    sale: 20,
    image: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
    video: {
      main: 'www',
      sub: ['www1', 'www2'],
    },
    category_list: ['Sandbox', 'RTS', 'FPS'],
  },
];

const GameInfoWrapper = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 2rem;
`;

const Category = () => {
  const CategoryListArr = [
    'Sandbox',
    'Real-time strategy (RTS)',
    'Shooters (FPS and TPS)',
    'Multiplayer online battle arena (MOBA)',
    'Role-playing (RPG, ARPG, and More)',
    'Simulation and sports.',
    'Puzzlers and party games.',
    'Action-adventure.',
    'Sandbox',
    'Real-time strategy (RTS)',
    'Shooters (FPS and TPS)',
    'Multiplayer online battle arena (MOBA)',
    'Role-playing (RPG, ARPG, and More)',
    'Simulation and sports.',
    'Puzzlers and party games.',
    'Action-adventure.',
  ];

  return (
    <div>
      <GameInfoWrapper>
        <Text types="large">카테고리 리스트</Text>
        <CategoryList list={CategoryListArr}></CategoryList>
        <Text types="large">게임 리스트</Text>

        {mockData.map((eachGame, i) => {
          return <GameInfo key={i} {...eachGame} />;
        })}
      </GameInfoWrapper>
    </div>
  );
};

export default Category;
