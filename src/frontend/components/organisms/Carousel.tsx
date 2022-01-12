import React from 'react';
import Carousel from 'react-multi-carousel';
import styled from 'styled-components';
import 'react-multi-carousel/lib/styles.css';
import gameImage2 from 'public/game2.jpg';
import Image from 'next/image';

interface CarouselProps {
  slides: Object;
}

const CustomCarousel = styled(Carousel)`
  .react-multiple-carousel__arrow--right {
    margin-right: 2%;
    margin-bottom: 4%;
    background: ${(props) => props.theme.colors.secondaryBg};
  }
  .react-multiple-carousel__arrow--left {
    margin-left: -3%;
    margin-bottom: 4%;
    background: ${(props) => props.theme.colors.secondaryBg};
  }
`;

export default function CarouselComponent(props: CarouselProps) {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div>
      <CustomCarousel
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        autoPlay={true}
        autoPlaySpeed={2000}
        infinite
        removeArrowOnDeviceType={['mobile']}
      >
        {props.slides}
      </CustomCarousel>
    </div>
  );
}
