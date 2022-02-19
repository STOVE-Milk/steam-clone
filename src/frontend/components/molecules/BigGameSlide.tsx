import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styled from 'styled-components';

import { gameInfo } from 'modules/game';

export interface BigGameSlideProps {
  id: number;
  src: string;
}

export default function BigGameSlide(props: BigGameSlideProps) {
  return (
    <Link href={`/game/${props.id}`}>
      <SlideWrapper>
        <Image src={props.src} layout="fill" objectFit="cover"></Image>
        {/* image={<Image src={data % 2 ? gameImage1 : gameImage2} layout="responsive" />} */}
      </SlideWrapper>
    </Link>
  );
}

const SlideWrapper = styled.div`
  display: block;
  height: calc(100vw / 3);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;
