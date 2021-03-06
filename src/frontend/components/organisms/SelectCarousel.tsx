import React from 'react';
import styled from 'styled-components';

import Carousel from 'react-multi-carousel';
import { ButtonGroupProps } from 'react-multi-carousel/lib/types';
import 'react-multi-carousel/lib/styles.css';

interface ICarouselProps {
  slides: Object; //carousel에서 element로 쓰일 슬라이드
  buttons: JSX.Element[]; //SelectCarousel에서 아래쪽에 있는 사진 4개
}

//carousel 반응형을 위해 breakpoint 지정
export default function CarouselComponent(props: ICarouselProps) {
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
        {props.buttons &&
          props.buttons.map((img, i) => {
            return (
              <Button key={i} onClick={() => goToSlide && goToSlide(i)}>
                {img}
              </Button>
            );
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
      removeArrowOnDeviceType={['small']}
      customButtonGroup={<CustomButtonGroup />}
      renderButtonGroupOutside={true}
    >
      {props.slides}
    </CustomCarousel>
  );
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
  cursor: pointer;

  :hover {
    border: 1px solid white;
  }
`;
