import React from 'react';
import Logo from 'public/steam_logo.png';
import styled from 'styled-components';
import Image from 'next/image';
import Text from 'components/atoms/Text';

import { localePrice } from 'util/localeString';

export interface IGiftCardInfoProps {
  id: number;
  name: string;
  price: number;
  checked?: boolean;
  onClick?: (id: number) => void;
}
interface IGiftCardStyledType {
  idx: number;
  onClick?: (id: number) => void;
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
  padding: 1rem;
  ${(props) => props.theme.breakpoints.medium} {
    margin: 0 1rem 1rem 0;
  }
`;
const GiftCardUnchecked = styled(GiftCardBox)`
  border: 1px solid ${(props) => props.theme.colors.secondaryBg};
  &:hover {
    border: 1px solid ${(props) => props.theme.colors.divider};
  }
`;
const GiftCardChecked = styled(GiftCardBox)`
  border: 1px solid ${(props) => props.theme.colors.activeBg};
  background: ${(props) => props.theme.colors.activeBg};
`;
const GiftCardText = styled(Text)`
  word-break: break-all;
  text-align: center;
`;
export default function GiftCard(GiftCardInfoProps: IGiftCardInfoProps) {
  //TO DO & QUESTION(Yangha): 스타일드 컴포넌트 하나로 합치고싶은데 그게 더 좋은 코드가 맞을까요?
  return GiftCardInfoProps.checked ? (
    <GiftCardChecked
      idx={GiftCardInfoProps.id}
      onClick={() => {
        GiftCardInfoProps.onClick && GiftCardInfoProps.onClick(GiftCardInfoProps.id);
      }}
    >
      <Image src={Logo} layout={'fixed'} width={50} height={50} />
      <GiftCardText types="medium">{GiftCardInfoProps.name}</GiftCardText>
      <Text types="medium">{`${localePrice(GiftCardInfoProps.price, 'KR')}`}</Text>
    </GiftCardChecked>
  ) : (
    <GiftCardUnchecked
      idx={GiftCardInfoProps.id}
      onClick={() => {
        GiftCardInfoProps.onClick && GiftCardInfoProps.onClick(GiftCardInfoProps.id);
      }}
    >
      <Image src={Logo} layout={'fixed'} width={40} height={40} />
      <GiftCardText>{GiftCardInfoProps.name}</GiftCardText>
      <Text>{`${localePrice(GiftCardInfoProps.price, 'KR')}`}</Text>
    </GiftCardUnchecked>
  );
}
