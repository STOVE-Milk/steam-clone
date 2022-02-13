import React from 'react';
import styled from 'styled-components';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

interface ICarouselProps {
  slides: Object;
}

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
      customDot={<DotBar />}
    >
      {props.slides}
    </CustomCarousel>
  );
}

const CustomCarousel = styled(Carousel)`
  width: 80%;
  margin: 0 auto;
`;

const DotBar = styled.div`
  width: 10%;
  height: 3px;
  margin: 0 1rem;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.divider};
`;
