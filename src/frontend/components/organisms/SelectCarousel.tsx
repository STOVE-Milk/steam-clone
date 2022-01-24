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

const CustomCarousel = styled(Carousel)``;

const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: nowrap;
  overflow: hidden;
  padding-top: 1rem;
`;

const Button = styled.div`
  width: 23%;
  overflow: hidden;
  border-radius: 10px;
  height: calc(100vw / 12);
  position: relative;
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
    return (
      <ButtonGroup>
        {props.buttons.map((img, i) => {
          return <Button onClick={() => goToSlide && goToSlide(i)}>{img}</Button>;
        })}
      </ButtonGroup>
    );
  };

  return (
    <CustomCarousel
      arrows={false}
      slidesToSlide={1}
      responsive={responsive}
      ssr={true} // means to render carousel on server-side.
      // autoPlay={true}
      // autoPlaySpeed={2000}
      infinite
      removeArrowOnDeviceType={['small']}
      customButtonGroup={<CustomButtonGroup />}
      renderButtonGroupOutside={true}
    >
      {props.slides}
    </CustomCarousel>
  );
}
