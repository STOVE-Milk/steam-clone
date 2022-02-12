import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { gameInfo } from 'modules/game';

export default function BigGameSlide(props: gameInfo) {
  return (
    <SlideWrapper>
      <Image src={props.image.main} layout="fill" objectFit="cover"></Image>
    </SlideWrapper>
  );
}

const SlideWrapper = styled.div`
  display: block;
  height: calc(100vw / 3);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;
