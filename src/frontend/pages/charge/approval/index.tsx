import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';

import DefaultButton from 'components/atoms/DefaultButton';

import { IState } from 'modules';
import { useSelector, useDispatch } from 'react-redux';
import { doApprovalCharge } from 'modules/user';

const setPgToken = () => {
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value): any => {
    localStorage.setItem(key, value);
  });
};

const approval: NextPage<IState> = () => {
  //TO DO(양하): 리팩토링 -> 생각해보면 이거야말로 그냥 request만 보내면 되는 요청같음, 굳이 store 안거치고
  const { charge } = useSelector((state: IState) => state.user);
  console.log('어푸ㅠ르발데이터', charge.data);
  const approvalReqObj = {
    method: 'kakaopay',
    tid: typeof window !== 'undefined' && localStorage.getItem('tid') != null ? localStorage.getItem('tid') : '',
    pg_token:
      typeof window !== 'undefined' && localStorage.getItem('pg_token') != null ? localStorage.getItem('pg_token') : '',
  };

  const dispatch = useDispatch();

  if (typeof window !== 'undefined') {
    setPgToken();
  }
  return (
    <DefaultButton
      types={'primary'}
      onClick={() => {
        dispatch(doApprovalCharge.request(approvalReqObj));
        // window.close();
      }}
    >
      충전 승인하기
    </DefaultButton>
  );
};

export default approval;
