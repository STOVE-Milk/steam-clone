import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Text from 'components/atoms/Text';
import { localePrice } from 'util/localeString';

// 이거 다 안써도 되나?
export interface IGameInfo {
  category_list: string[];
  description_snippet: string;
  download_count: number;
  id: number;
  image: {
    main: string;
    sub: string[];
  };
  name: string;
  os_list: string[];
  price: number;
  sale: number;
  video?: {
    main: string;
    sub: string[];
  };
}

export default function GameSlide(props: IGameInfo) {
  return (
    <SlideWrapper>
      <ImageSection>
        <Image src={props.image.main} layout="fill" objectFit="cover"></Image>
      </ImageSection>
      <InfoSection>
        <Text types="small">{props.name}</Text>
        <Text types="tiny">{`${localePrice(props.price, 'KR')}`}</Text>
      </InfoSection>
    </SlideWrapper>
  );
}

const SlideWrapper = styled.div`
  width: 100%;
  min-height: 250px;
  padding: 1rem 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ImageSection = styled.div`
  width: 100%;
  height: 80%;
  flex: 1;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  position: relative;
`;

const InfoSection = styled.div`
  height: 70px;
  background: ${(props) => props.theme.colors.secondaryBg};
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: black;
  border-radius: 0 0 10px 10px;
  line-height: normal;
`;
