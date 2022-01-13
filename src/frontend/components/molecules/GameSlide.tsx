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

export default function GameSlide(props: SlideProps) {
  return (
    <SlideWrapper>
      <ImageSection>{props.image}</ImageSection>
      <InfoSection>
        <Text types="small">{props.info.name}</Text>
        <Text types="tiny">{`${localePrice(props.info.price, 'KR')}`}</Text>
      </InfoSection>
    </SlideWrapper>
  );
}
