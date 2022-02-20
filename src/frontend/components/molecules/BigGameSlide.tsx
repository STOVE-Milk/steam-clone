import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styled from 'styled-components';

import { localePrice } from 'util/localeString';
import { gameInfo } from 'modules/game';

import Text from 'components/atoms/Text';

interface BigGameSlideProps {
  game: gameInfo;
  type: string;
}

export default function BigGameSlide(props: BigGameSlideProps) {
  return (
    <Link href={`/game/${props.game.id}`}>
      <SlideWrapper>
        <ImageSection>
          <Image src={props.game.image.main} layout="fill" objectFit="cover"></Image>
        </ImageSection>
        {props.type === 'main' ? (
          <InfoSection>
            <Text types="large">{props.game.name}</Text>
            <Desc types="main">{props.game.description_snippet}</Desc>
            <SubImgSection>
              {props.game.image.sub.slice(0, 4).map((img) => {
                return (
                  <SubImgWrapper>
                    <SubImg src={img} layout="fill"></SubImg>;
                  </SubImgWrapper>
                );
              })}
            </SubImgSection>
          </InfoSection>
        ) : null}
      </SlideWrapper>
    </Link>
  );
}

const SlideWrapper = styled.div`
  display: flex;
  height: calc(100vw / 3);
  border-radius: 10px;
  overflow: hidden;
`;

const ImageSection = styled.div`
  width: 100%;
  flex: 3;
  overflow: hidden;
  position: relative;
  border-radius: 0 0 0 10px;
`;

const InfoSection = styled.div`
  flex: 1;
  background: ${(props) => props.theme.colors.secondaryBg};
  padding: 2rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  color: black;
  line-height: normal;
  border-radius: 0 0 10px;
`;

const Desc = styled(Text)`
  margin: 1rem 0;
  line-height: 1.5rem;
`;

const SubImgSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const SubImgWrapper = styled.div`
  width: 45%;
  height: 100px;
  position: relative;
  margin: 0.3rem;
`;

const SubImg = styled(Image)`
  border-radius: 5px;
`;
