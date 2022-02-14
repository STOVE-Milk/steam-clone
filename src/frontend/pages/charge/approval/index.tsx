import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';

import styled from 'styled-components';

import { IState } from 'modules';

import DefaultButton from 'components/atoms/DefaultButton';
import Text from 'components/atoms/Text';

const setPgToken = () => {
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value): any => {
    window.localStorage.setItem(key, value);
  });
};

const approval: NextPage<IState> = () => {
  const timeOut = (time: number) => {
    console.log(time);
    const interval = setInterval(() => {
      document.querySelector('#timer')!.innerHTML = `${time}초 후에 창이 닫힙니다.`;
      if (time < 0) {
        clearInterval(interval);
        window.close();
      }
      time--;
    }, 1000);
  };
  if (typeof window !== 'undefined') {
    setPgToken();
    timeOut(3);
  }

  return (
    <CloseWrapper>
      <Timer id="timer">{}</Timer>
      <CloseBtn
        types={'primary'}
        onClick={() => {
          window.close();
        }}
      >
        닫기
      </CloseBtn>
    </CloseWrapper>
  );
};
const CloseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`;
const Timer = styled(Text)<{ id: string }>`
  margin: 2rem 1rem;
  display: block;
`;
const CloseBtn = styled(DefaultButton)`
  width: 20rem;
`;

export default approval;
