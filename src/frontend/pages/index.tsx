import React, { useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import Carousel from 'react-multi-carousel';
import { ButtonGroupProps, ArrowProps, DotProps } from 'react-multi-carousel/lib/types';
import 'react-multi-carousel/lib/styles.css';
import gameImage from 'public/game.png';
import gameImage2 from 'public/game2.jpeg';
import Image from 'next/image';
import DefaultButton from 'components/atoms/DefaultButton';
import dynamic from 'next/dynamic';

const NoSSRComponent = dynamic(() => import('components/organisms/map'), {
  ssr: false,
});

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CarouselSection = styled.div`
  width: 1000px;
  border: 1px solid black;
`;

const Home: NextPage = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <MainWrapper>
      <CarouselSection>
        <Carousel
          swipeable={true}
          draggable={true}
          showDots={true}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          // autoPlay={true}
          autoPlaySpeed={1000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={['tablet', 'mobile']}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
        >
          <Image src={gameImage} />
          <Image src={gameImage2} />
          <Image src={gameImage} />
        </Carousel>
      </CarouselSection>
      {/* <NoSSRComponent /> */}
    </MainWrapper>
  );
};

export default Home;
