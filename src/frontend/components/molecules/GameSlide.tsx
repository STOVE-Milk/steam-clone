import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Text from 'components/atoms/Text';

interface SlideProps {
  image: JSX.Element | typeof Image;
  info: {
    name: string;
    price: string;
  };
}

const SlideWrapper = styled.div`
  width: 200px;
  height: 250px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ImageSection = styled.div`
  height: 200px;
  overflow: hidden;
`;

const InfoSection = styled.div`
  flex: 1;
  background: ${(props) => props.theme.colors.secondaryBg};
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  color: black;
`;

const Info = styled(Text)`
  padding: 5px;
`;

export default function GameSlide(props: SlideProps) {
  return (
    <SlideWrapper>
      <ImageSection>{props.image}</ImageSection>
      <InfoSection>
        <Info types="small">{props.info.name}</Info>
        <Info types="tiny">{`$ ${props.info.price}`}</Info>
      </InfoSection>
    </SlideWrapper>
  );
}
