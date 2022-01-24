import React from 'react';
import Carousel from 'react-multi-carousel';
import styled from 'styled-components';
import 'react-multi-carousel/lib/styles.css';
import { ButtonGroupProps } from 'react-multi-carousel/lib/types';
import gameImage1 from 'public/game.png';
import gameImage2 from 'public/game2.jpg';
import Image from 'next/image';

interface CarouselProps {
  slides: Object;
  buttons: JSX.Element[];
}

const CustomCarousel = styled(Carousel)`
  width: 80%;

  margin: 0 auto;
`;

export default function CarouselComponent(this: any, props: CarouselProps) {
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

  const CustomButtonGroup = ({ goToSlide }: ButtonGroupProps) => {
    const array = [0, 1, 2, 3, 4, 5];
    return (
      <div className="custom-button-group" style={{ position: 'absolute' }}>
        {props.buttons.map((img, i) => {
          return <div onClick={() => goToSlide && goToSlide(i)}>{img}</div>;
        })}
      </div>
    );
  };

  return (
    <CustomCarousel
      // focusOnSelect={true}
      arrows={false}
      // showDots
      slidesToSlide={1}
      responsive={responsive}
      ssr={true} // means to render carousel on server-side.
      // autoPlay={true}
      // autoPlaySpeed={2000}
      partialVisbile
      infinite
      removeArrowOnDeviceType={['small']}
      customButtonGroup={<CustomButtonGroup />}
    >
      {props.slides}
    </CustomCarousel>
  );
}
