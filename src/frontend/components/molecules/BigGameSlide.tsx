import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Text from 'components/atoms/Text';
import { localePrice } from 'util/localeString';

interface SlideProps {
  image: JSX.Element | typeof Image;
  info: {
    name: string;
    price: number;
  };
}

const SlideWrapper = styled.div`
  width: 100%;
  /* height: 30%; */
  height: 500px;
  padding: 1rem 0 1rem 1rem;
  overflow: hidden;
`;

const ImageSection = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

export default function BigGameSlide(props: SlideProps) {
  return (
    <SlideWrapper>
      <ImageSection>{props.image}</ImageSection>
    </SlideWrapper>
  );
}
