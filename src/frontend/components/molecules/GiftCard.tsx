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
  checked?: boolean;
  onClick?: (idx: number) => void;
}
interface IGiftCardStyledType {
  idx: number;
  onClick?: (idx: number) => void;
}
const GiftCardBox = styled.div<IGiftCardStyledType>`
  width: 10rem;
  height: 15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 10px;
  cursor: pointer;
  background: ${(props) => props.theme.colors.secondaryBg};
`;
const GiftCardUnchecked = styled(GiftCardBox)`
  border: 1px solid ${(props) => props.theme.colors.secondaryBg};
  &:hover {
    border: 1px solid ${(props) => props.theme.colors.divider};
  }
  ${(props) => props.theme.breakpoints.medium} {
    margin: 0 1rem 1rem 0;
  }
`;
const GiftCardChecked = styled(GiftCardBox)`
  border: 1px solid ${(props) => props.theme.colors.activeBg};
  background: ${(props) => props.theme.colors.activeBg};
`;

export default function GiftCard(GiftCardInfoProps: IGiftCardInfoProps) {
  //TO DO & QUESTION(Yangha): 스타일드 컴포넌트 하나로 합치고싶은데 그게 더 좋은 코드가 맞을까요?
  return GiftCardInfoProps.checked ? (
    <GiftCardChecked
      idx={GiftCardInfoProps.idx}
      onClick={() => {
        GiftCardInfoProps.onClick && GiftCardInfoProps.onClick(GiftCardInfoProps.idx);
      }}
    >
      <Image src={Logo} layout={'fixed'} width={50} height={50} />
      <Text types="medium">{GiftCardInfoProps.name}</Text>
      <Text types="medium">{`${localePrice(GiftCardInfoProps.price, 'KR')}`}</Text>
    </GiftCardChecked>
  ) : (
    <GiftCardUnchecked
      idx={GiftCardInfoProps.idx}
      onClick={() => {
        GiftCardInfoProps.onClick && GiftCardInfoProps.onClick(GiftCardInfoProps.idx);
      }}
    >
      <Image src={Logo} layout={'fixed'} width={40} height={40} />
      <Text>{GiftCardInfoProps.name}</Text>
      <Text>{`${localePrice(GiftCardInfoProps.price, 'KR')}`}</Text>
    </GiftCardUnchecked>
  );
}
