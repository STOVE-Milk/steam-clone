import React from 'react';
import Carousel from 'react-multi-carousel';
import styled from 'styled-components';
import 'react-multi-carousel/lib/styles.css';
import gameImage1 from 'public/game.png';
import gameImage2 from 'public/game2.jpg';
import Image from 'next/image';

interface CarouselProps {
  slides: Object;
}

const CustomCarousel = styled(Carousel)`
  width: 80%;

  margin: 0 auto;
`;

export default function CarouselComponent(props: CarouselProps) {
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

  const array = [1, 2, 3, 4, 5];
  const images = array.map((a) => <Image src={a % 2 ? gameImage1 : gameImage2} width={30} height={30} />);

  const CustomDot = (props: { index: number }) => {
    return <button>{React.Children.toArray(images)[props.index]}</button>;
  };

  return (
    <CustomCarousel
      showDots
      slidesToSlide={1}
      responsive={responsive}
      ssr={true} // means to render carousel on server-side.
      // autoPlay={true}
      // autoPlaySpeed={2000}
      partialVisbile
      infinite
      removeArrowOnDeviceType={['small']}
      customDot={<CustomDot index={1} />}
    >
      {props.slides}
      {console.log(React.Children.toArray)}
    </CustomCarousel>
  );
}
