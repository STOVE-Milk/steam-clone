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

const SlideWrapper = styled.div`
  display: block;
  height: calc(100vw / 3);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

export default function BigGameSlide(props: IGameInfo) {
  return (
    <SlideWrapper>
      <Image src={props.image.main} layout="fill" objectFit="cover"></Image>
    </SlideWrapper>
  );
}
