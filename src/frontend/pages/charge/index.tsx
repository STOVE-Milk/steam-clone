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
import { getGiftCardList, doCharge } from 'modules/user';
import { IGiftcard } from 'modules/user/types';

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

const charge: NextPage<IState> = () => {
  const [curCheckedPriceIdx, setCurCheckedPriceIdx] = useState(1);
  const [chargeMethod, setChargeMethod] = useState('kakaopay');
  // const [chargeReqInfoObj, setChargeReqInfoObj] = useState({
  //   method: chargeMethod,
  //   giftcard: {
  //     id: curCheckedPriceIdx,
  //     name: 'name', //아무거나(검증로직 없음)
  //     price: 5000, //아무거나(검증로직 없음)
  //   },
  // });
  //요청상태에따라 return 을 달리하고, store에 pg_token 보관해야겠다. 충전상태 == 'finished' ? 지금 만든 chargeWraaper로 감싸진 페이지 : 완료되었습니다 페이지
  const { giftCardList, charge } = useSelector((state: IState) => {
    console.log(state.user.giftCardList);
    return state.user;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGiftCardList.request({}));
    // dispatch(doCharge.request(chargeReqInfoObj));
  }, []);

  const giftCardListData = giftCardList.data && Object.values(giftCardList.data);
  // setState 비동기처리
  // const updateState = async (chargeMethod: string, curCheckedPriceIdx: number) => {
  //   return new Promise((resolve, reject) => {
  //     dispatch(
  //       doCharge.request({
  //         method: chargeMethod,
  //         giftcard: {
  //           id: curCheckedPriceIdx,
  //           name: '', //아무거나(검증로직 없음)
  //           price: 0, //아무거나(검증로직 없음)
  //         },
  //       }),
  //     );
  //   }).then(() => {
  //     () => {
  //       console.log('here');
  //       // http://localhost:3000/charge/approval?pg_token=e703bc6b3f22d3e90ece
  //       window.open(
  //         `${charge.data!.next_redirect_pc_url}`,
  //         'next_pc_url',
  //         'location,status,scrollbars,resizable,width=600,height=600',
  //       );
  //     };
  //   });
  // };
  const updateState = async (chargeMethod: string, curCheckedPriceIdx: number) => {
    console.log('here');
  };

  // const doDispatch = (chargeReqInfoObj: IDoChargeReqType) => {
  //   return new Promise((resolve, reject) => {
  //     dispatch(doCharge.request(chargeReqInfoObj));
  //   });
  // };
  const doChargeByBtn = async (giftCardListData: IGiftcard[]) => {
    alert(
      `충전하고자하는 금액은 총 ${localePrice(
        giftCardListData.find((ele: any) => ele.id === curCheckedPriceIdx)!.price,
        'KR',
      )} 입니다.\n충전 방식은 ${chargeMethod}입니다.
    `,
    );
    dispatch(
      doCharge.request({
        method: chargeMethod,
        giftcard: {
          id: curCheckedPriceIdx,
          name: '', //아무거나(검증로직 없음)
          price: 0, //아무거나(검증로직 없음)
        },
      }),
    );
    //자꾸 통신 성공인데 null 보내줘서 처리해야됨
    window.open(
      `${charge.data!.next_redirect_pc_url}`,
      'next_pc_url',
      'location,status,scrollbars,resizable,width=600,height=600',
    );
  };

  return (
    <ChargeWrapper>
      {console.log(giftCardListData)}
      <TitleStyle types="large">구매 가능한 GIFTCARDS</TitleStyle>
      {/* {console.log(giftCardList)} */}
      <GiftCardWrapper>
        {giftCardListData &&
          giftCardListData.map((eachGiftCard) => {
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
            giftCardListData && doChargeByBtn(giftCardListData);
          }}
        >
          충전하기
        </DefaultButton>
      </ConfirmBtnBox>
    </ChargeWrapper>
  );
};

export default charge;
