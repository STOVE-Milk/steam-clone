import React from 'react';
import styled from 'styled-components';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface ICarouselProps {
  slides: Object; //carousel에서 element로 쓰일 슬라이드
}

//carousel 반응형을 위해 breakpoint 지정
export default function BigCarouselComponent(props: ICarouselProps) {
  const responsive = {
    large: {
      breakpoint: { max: 3000, min: 1048 },
      items: 1,
    },
    medium: {
      breakpoint: { max: 1047, min: 640 },
      items: 1,
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
      showDots={true}
      arrows={false}
    >
      {props.slides}
    </CustomCarousel>
  );
}

const CustomCarousel = styled(Carousel)`
  width: 80%;
  margin: 0 auto;

  .react-multi-carousel-dot button {
    margin: 0 1rem;
    margin-bottom: 1rem;
    border-radius: 10px;
    border: none;
    background: ${(props) => props.theme.colors.divider};

    :active {
      background: ${(props) => props.theme.colors.activeBg};
    }
  }
`;
