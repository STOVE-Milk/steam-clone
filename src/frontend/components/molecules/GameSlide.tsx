import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styled from 'styled-components';

import { gameInfo } from 'modules/game';

import Text from 'components/atoms/Text';

export default function GameSlide(props: gameInfo) {
  return (
    <Link href={`/game/${props.id}`}>
      <SlideWrapper>
        <ImageSection>
          <Image src={props.image.main} layout="fill" objectFit="cover"></Image>
        </ImageSection>
        <InfoSection>
          <Text types="small">{props.name}</Text>
          <div>
            <Text types="tiny">긍정적 평가</Text>
            <Text types="tiny">
              {`${
                props.recommend_count &&
                props.review_count &&
                Math.floor(props.recommend_count / props.review_count) * 100
              }%`}
            </Text>
          </div>
        </InfoSection>
      </SlideWrapper>
    </Link>
  );
}

const SlideWrapper = styled.div`
  width: 100%;
  min-height: 250px;
  padding: 1rem 0 1rem 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
`;

const ImageSection = styled.div`
  width: 100%;
  height: 80%;
  flex: 1;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  position: relative;
`;

const InfoSection = styled.div`
  height: 70px;
  background: ${(props) => props.theme.colors.secondaryBg};
  padding: 0.5rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: black;
  border-radius: 0 0 10px 10px;
  line-height: normal;
`;
