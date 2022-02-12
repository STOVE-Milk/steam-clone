import React from 'react';
import Carousel from 'react-multi-carousel';
import styled from 'styled-components';
import 'react-multi-carousel/lib/styles.css';
import gameImage2 from 'public/game2.jpg';
import Image from 'next/image';

interface ICarouselProps {
  slides: Object;
}

export default function CarouselComponent(props: ICarouselProps) {
  const responsive = {
    large: {
      breakpoint: { max: 3000, min: 1048 },
      items: 4,
    },
    medium: {
      breakpoint: { max: 1047, min: 640 },
      items: 3,
    },
    small: {
      breakpoint: { max: 639, min: 0 },
      items: 1,
    },
  };

  return (
    <CustomCarousel
      responsive={responsive}
      ssr={true} // means to render carousel on server-side.
      autoPlay={true}
      autoPlaySpeed={3000}
      infinite
      removeArrowOnDeviceType={['small']}
    >
      {props.slides}
    </CustomCarousel>
  );
}

const CustomCarousel = styled(Carousel)`
  width: 80%;
  margin: 0 auto;

  .react-multiple-carousel__arrow--right {
    margin-right: -3%;
    margin-bottom: 8%;
    background: ${(props) => props.theme.colors.secondaryBg};
  }
  .react-multiple-carousel__arrow--left {
    margin-left: -2%;
    margin-bottom: 8%;
    background: ${(props) => props.theme.colors.secondaryBg};
  }
`;
