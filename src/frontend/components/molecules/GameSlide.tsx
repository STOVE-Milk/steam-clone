import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Text from 'components/atoms/Text';

interface SlideProps {
  image: typeof Image;
  info: {
    name: string;
    price: string;
  };
}

const SlideWrapper = styled.div`
  width: 300px;
  height: 500px;
  border: 1px solid black;
  border-radius: 10px;
`;

const ImageSection = styled.div`
  height: 400px;
`;

const InfoSection = styled.div`
  background: ${(props) => props.theme.colors.plain};
`;

export default function GameSlide(props: SlideProps) {
  return (
    <SlideWrapper>
      <ImageSection>{props.image}</ImageSection>
      <InfoSection>
        <Text types="medium">{props.info.name}</Text>
        <Text types="medium">{props.info.price}</Text>
      </InfoSection>
    </SlideWrapper>
  );
}
