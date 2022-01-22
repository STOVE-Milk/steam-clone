import React from 'react';
import type { NextPage } from 'next';

import styled from 'styled-components';
import GiftCard from 'components/molecules/GiftCard';
import Text from 'components/atoms/Text';
import CommonSelectBox from 'components/atoms/CommonSelectBox';
import { IGiftCardInfoProps } from 'components/molecules/GiftCard';
import DefaultButton from 'components/atoms/DefaultButton';

const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
  display: block;
`;
const ChargeWrapper = styled.section`
  margin: 2rem auto;
  width: 80%;
`;
const GiftCardWrapper = styled.section`
  display: flex;
  padding-top: 1rem;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  ${(props) => props.theme.breakpoints.medium} {
    justify-content: unset;
  }
`;
const ChargeTypeSelectWrapper = styled.section`
  margin-bottom: 2rem;
`;
const ConfirmBtnBox = styled.section`
  display: flex;
  justify-content: right;
`;

const giftcardsmockData: Array<IGiftCardInfoProps> = [
  {
    idx: 1,
    name: '5000원',
    price: 5000,
  },
  {
    idx: 2,
    name: '10000원',
    price: 10000,
  },
  {
    idx: 3,
    name: '30000원',
    price: 30000,
  },
  {
    idx: 4,
    name: '50000원',
    price: 50000,
  },
];
//TO DO(양하): 결제수단 확장성때문에 만들어놓음
const ChargeTypes = [
  { name: 'Kakao Pay', value: 'Kakaopay', disabled: false },
  { name: 'Toss', value: 'Toss', disabled: true },
];

const charge: NextPage = () => {
  return (
    <ChargeWrapper>
      <TitleStyle types="large">구매 가능한 GIFTCARDS</TitleStyle>
      <GiftCardWrapper>
        {giftcardsmockData.map((eachGiftCard) => {
          return <GiftCard key={eachGiftCard.idx} {...eachGiftCard}></GiftCard>;
        })}
      </GiftCardWrapper>
      <ChargeTypeSelectWrapper>
        <TitleStyle types="large">구매 방법</TitleStyle>
        <CommonSelectBox optionArr={ChargeTypes} handleSelect={(e) => console.log(e.target.value)}></CommonSelectBox>
      </ChargeTypeSelectWrapper>
      <ConfirmBtnBox>
        <DefaultButton types={'secondary'}>충전하기</DefaultButton>
      </ConfirmBtnBox>
    </ChargeWrapper>
  );
};

export default charge;
