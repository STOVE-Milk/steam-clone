import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';

import styled from 'styled-components';

import { IState } from 'modules';
import * as ChargeAPI from 'api/charge/api';
import { useRouter } from 'next/router';

import { getItemFromLocalStorage } from 'util/getItemFromLocalStorage';
import Text from 'components/atoms/Text';
import DefaultButton from 'components/atoms/DefaultButton';

const approval: NextPage<IState> = () => {
  const router = useRouter();

  return (
    <FinishWrapper>
      <TitleStyle>충전 승인을 위해 승인버튼을 눌러주세요.</TitleStyle>
      <ApproveBtn
        types={'primary'}
        onClick={async () => {
          const approvalReqObj = {
            method: 'kakaopay',
            tid: getItemFromLocalStorage('tid'),
            pg_token: getItemFromLocalStorage('pg_token'),
          };
          const res = await ChargeAPI.doApprovalChargeAPI(approvalReqObj);
          alert(res.message);
          router.push('/');
        }}
      >
        충전승인하기
      </ApproveBtn>
    </FinishWrapper>
  );
};
const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
  display: block;
`;
const FinishWrapper = styled.div`
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ApproveBtn = styled(DefaultButton)`
  width: 50%;
`;
export default approval;
