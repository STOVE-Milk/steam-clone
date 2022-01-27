import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';

import styled from 'styled-components';
import GiftCard from 'components/molecules/GiftCard';
import Text from 'components/atoms/Text';
import CommonSelectBox from 'components/atoms/CommonSelectBox';
import { IGiftCardInfoProps } from 'components/molecules/GiftCard';
import DefaultButton from 'components/atoms/DefaultButton';

import { localePrice } from 'util/localeString';

import { useSelector, useDispatch } from 'react-redux';
import { IState } from 'modules';
import { getGiftCardList } from 'modules/user';

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
    id: 1,
    name: '5000원',
    price: 5000,
  },
  {
    id: 2,
    name: '10000원',
    price: 10000,
  },
  {
    id: 3,
    name: '30000원',
    price: 30000,
  },
  {
    id: 4,
    name: '50000원',
    price: 50000,
  },
];

//TO DO(양하): 결제수단 확장성때문에 만들어놓음
const ChargeTypes = [
  { name: 'Kakao Pay', value: 'Kakaopay', disabled: false },
  { name: 'Toss', value: 'Toss', disabled: true },
];

const charge: NextPage<IState> = () => {
  const [curCheckedPriceIdx, setCurCheckedPriceIdx] = useState(1);
  const [chargeMethod, setChargeMethod] = useState('kakaopay');
  const [giftcards, setGiftcards] = useState([]);
  //요청상태에따라 return 을 달리하고, store에 pg_token 보관해야겠다. 충전상태 == 'finished' ? 지금 만든 chargeWraaper로 감싸진 페이지 : 완료되었습니다 페이지
  const { giftCardList } = useSelector((state: IState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGiftCardList.request({}));
  }, []);

  return (
    <ChargeWrapper>
      <TitleStyle types="large">구매 가능한 GIFTCARDS</TitleStyle>
      {console.log(giftCardList.data)}
      <GiftCardWrapper>
        {giftCardList.data &&
          giftCardList.data.map((eachGiftCard) => {
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
          onClick={(e) =>
            // POST: /payment/charge/ready
            {
              giftCardList.data &&
                alert(
                  `충전하고자하는 금액은 총 ${localePrice(
                    giftCardList.data.find((ele) => ele.id === curCheckedPriceIdx)!.price,
                    'KR',
                  )} 입니다.\n충전 방식은 ${chargeMethod}입니다.
                `,
                );
              window.open('/category', 'next_pc_url', 'location,status,scrollbars,resizable,width=600, height=600');
            }
          }
        >
          충전하기
        </DefaultButton>
      </ConfirmBtnBox>
    </ChargeWrapper>
  );
};

export default charge;
