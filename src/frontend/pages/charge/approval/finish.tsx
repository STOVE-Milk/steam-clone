import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';

import DefaultButton from 'components/atoms/DefaultButton';

import { IState } from 'modules';
import { useSelector, useDispatch } from 'react-redux';
import { doApprovalCharge } from 'modules/user';
import { useRouter } from 'next/router';

const approval: NextPage<IState> = () => {
  //TO DO(양하): 리팩토링 -> 생각해보면 이거야말로 그냥 request만 보내면 되는 요청같음, 굳이 store 안거치고
  const { charge } = useSelector((state: IState) => state.user);

  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <DefaultButton
      types={'primary'}
      onClick={() => {
        const approvalReqObj = {
          method: 'kakaopay',
          tid: charge.data.tid,
          pg_token:
            typeof window !== 'undefined' && localStorage.getItem('pg_token') != null
              ? localStorage.getItem('pg_token')
              : '',
        };
        dispatch(doApprovalCharge.request(approvalReqObj));
      }}
    >
      충전승인하기
    </DefaultButton>
  );
};

export default approval;