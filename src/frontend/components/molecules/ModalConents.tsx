import React from 'react';
import Image from 'next/image';

import styled from 'styled-components';

import Text from 'components/atoms/Text';

interface IModalContentProps {
  title: string;
  description: string;
}

export const ModalConents = (props: IModalContentProps) => {
  const { title, description } = props;

  return (
    <div>
      <TitleStyle>{title}</TitleStyle>
      <Text>{description}</Text>
    </div>
  );
};
const TitleStyle = styled(Text)`
  display: block;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;
