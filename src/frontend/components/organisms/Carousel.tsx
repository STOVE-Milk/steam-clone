import React from 'react';
import styled from 'styled-components';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface ICarouselProps {
  slides: Object; //carousel에서 element로 쓰일 슬라이드
}

//carousel 반응형을 위해 breakpoint 지정
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
    margin: 3% -3% 8% 0;
    background: ${(props) => props.theme.colors.secondaryBg};
  }
  .react-multiple-carousel__arrow--left {
    margin: 3% 0 8% -2%;
    background: ${(props) => props.theme.colors.secondaryBg};
  }
`;
