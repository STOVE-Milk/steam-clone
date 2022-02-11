import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Text from 'components/atoms/Text';
import { localePrice } from 'util/localeString';

// 이거 다 안써도 되나?
export interface gameInfo {
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

const SlideWrapper = styled.div`
  width: 100%;
  height: 80%;
  padding: 1rem 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ImageSection = styled.div`
  width: 100%;
  flex: 1;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
`;

const InfoSection = styled.div`
  height: 30%;
  background: ${(props) => props.theme.colors.secondaryBg};
  padding: 1%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: black;
  padding-left: 5%;
  border-radius: 0 0 10px 10px;
`;

export default function GameSlide(props: gameInfo) {
  return (
    <SlideWrapper>
      <ImageSection>
        <Image src={props.image.main}></Image>
      </ImageSection>
      <InfoSection>
        <Text types="small">{props.name}</Text>
        <Text types="tiny">{`${localePrice(props.price, 'KR')}`}</Text>
      </InfoSection>
    </SlideWrapper>
  );
}
