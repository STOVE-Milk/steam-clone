import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Text from 'components/atoms/Text';
import { localePrice } from 'util/localeString';

interface SlideProps {
  image: JSX.Element | typeof Image;
}

const SlideWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  display: block;
  border-radius: 10px;
  height: 500px;
  overflow: hidden;
`;

export default function BigGameSlide(props: SlideProps) {
  return <SlideWrapper>{props.image}</SlideWrapper>;
}
