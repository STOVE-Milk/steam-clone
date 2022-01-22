import React from 'react';
import Logo from 'public/steam_logo.png';
import styled from 'styled-components';
import Image from 'next/image';
import Text from 'components/atoms/Text';

import { localePrice } from 'util/localeString';

export interface IGiftCardInfoProps {
  idx: number;
  name: string;
  price: number;
}
const GiftCardBox = styled.div`
  width: 10rem;
  height: 15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 10px;
  cursor: pointer;

  border: 1px solid ${(props) => props.theme.colors.secondaryBg};
  background: ${(props) => props.theme.colors.secondaryBg};

  &:hover {
    border: 1px solid ${(props) => props.theme.colors.divider};
  }
  ${(props) => props.theme.breakpoints.medium} {
    margin: 0 1rem 1rem 0;
  }
`;

export default function GiftCard(GiftCardInfoProps: IGiftCardInfoProps) {
  return (
    <GiftCardBox>
      <Image src={Logo} layout={'fixed'} width={40} height={40} />
      <Text>{GiftCardInfoProps.name}</Text>
      <Text>{`${localePrice(GiftCardInfoProps.price, 'KR')}`}</Text>
    </GiftCardBox>
  );
}
