import React, { useState, useEffect } from 'react';
import GameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';
import IGameInfo from 'pages/category';
import styled from 'styled-components';
import CategoryList from 'components/molecules/CategoryList';
import axios from 'axios';

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
      KR: 10000,
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
      KR: 20000,
    },
    sale: 0,
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
const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;
const ContentWrapper = styled.div`
  margin-bottom: 2rem;
`;
const Category = () => {
  const client = axios.create();
  const [categories, setCategories] = useState([]);

  const getCategories = () => {
    client.get('localhost:8080/store/categories').then((res: any) => {
      setCategories(res.data.data.category_list);
    });
  };

  useEffect(() => {
    getCategories();
  }, [categories]);

  return (
    <GameInfoWrapper>
      <ContentWrapper>
        <TitleStyle types="large">카테고리 리스트</TitleStyle>
        <CategoryList list={categories}></CategoryList>
      </ContentWrapper>
      <ContentWrapper>
        <TitleStyle types="large">게임 리스트</TitleStyle>
        {mockData.map((eachGame, i) => {
          return <GameInfo key={i} {...eachGame} />;
        })}
      </ContentWrapper>
    </GameInfoWrapper>
  );
};

export default Category;
