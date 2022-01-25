import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Text from 'components/atoms/Text';
import { localePrice } from 'util/localeString';

interface SlideProps {
  image: JSX.Element | typeof Image;
}

const SlideWrapper = styled.div`
  display: block;
  overflow: hidden;
  height: calc(100vw / 3);
  border-radius: 10px;
`;

export default function BigGameSlide(props: SlideProps) {
  return <SlideWrapper>{props.image}</SlideWrapper>;
}
