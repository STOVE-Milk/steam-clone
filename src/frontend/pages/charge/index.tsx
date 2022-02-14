import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import * as ChargeAPI from 'api/charge/api';
import { IState } from 'modules';
import { localePrice } from 'util/localeString';

import { IGiftcard } from 'modules/charge/types';
import GiftCard from 'components/molecules/GiftCard';
import Text from 'components/atoms/Text';
import CommonSelectBox from 'components/atoms/CommonSelectBox';
import DefaultButton from 'components/atoms/DefaultButton';

const charge: NextPage<IState> = () => {
  const router = useRouter();

  // const { charge } = useSelector((state: IState) => state.charge);

  const [giftCards, setGiftCards] = useState([] as IGiftcard[]);

  const [curCheckedPriceIdx, setCurCheckedPriceIdx] = useState(1);
  const [chargeMethod, setChargeMethod] = useState('kakaopay');

  const chargeReqInfoObj = {
    method: chargeMethod,
    giftcard: {
      id: curCheckedPriceIdx,
      name: 'name', //아무거나(검증로직 없음)
      price: 5000, //아무거나(검증로직 없음)
    },
  };
  useEffect(() => {
    getGiftCards();
  }, []);

  const getGiftCards = async () => {
    const res = await ChargeAPI.getGiftCardListAPI({});
    const giftcards = await res.data;
    setGiftCards(giftcards);
  };

  const doCharge = async () => {
    const res = await ChargeAPI.doChargeAPI(chargeReqInfoObj);
    const chargeInfoObj = await res.data;

    if (chargeInfoObj.next_redirect_pc_url !== null) {
      localStorage.setItem('tid', chargeInfoObj.tid);
      window.open(
        `${chargeInfoObj.next_redirect_pc_url}`,
        'next_pc_url',
        'location,status,scrollbars,resizable,width=600,height=600',
      );
    } else {
      alert('null 이 나오는 오류 ㅠ.ㅠ 다시시도해주세요');
    }
    router.push('/charge/approval/finish');
  };

  const doChargeByBtn = async (giftCardListData: IGiftcard[]) => {
    doCharge();
  };

  return (
    <ChargeWrapper>
      <TitleStyle types="large">구매 가능한 GIFTCARDS</TitleStyle>

      <GiftCardWrapper>
        {giftCards.map((eachGiftCard: any) => {
          const gcDataObj = {
            ...eachGiftCard,
            checked: eachGiftCard.id === curCheckedPriceIdx ? true : false,
            onClick: setCurCheckedPriceIdx,
          };
          return <GiftCard {...gcDataObj}></GiftCard>;
        })}
      </GiftCardWrapper>
      <ChargeTypeSelectWrapper>
        <TitleStyle types="large">구매 방법</TitleStyle>
        <CommonSelectBox
          optionArr={ChargeTypes}
          handleSelect={(e) => setChargeMethod(e.target.value)}
        ></CommonSelectBox>
      </ChargeTypeSelectWrapper>
      <ConfirmBtnBox>
        <DefaultButton
          types={'secondary'}
          onClick={(e) => {
            giftCards && doChargeByBtn(giftCards);
          }}
        >
          충전하기
        </DefaultButton>
      </ConfirmBtnBox>
    </ChargeWrapper>
  );
};

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

//TO DO(양하): 결제수단 확장성때문에 만들어놓음
const ChargeTypes = [
  { name: 'Kakao Pay', value: 'Kakaopay', disabled: false },
  { name: 'Toss', value: 'Toss', disabled: true },
];

export default charge;
