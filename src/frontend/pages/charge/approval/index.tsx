import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';

import DefaultButton from 'components/atoms/DefaultButton';

import { IState } from 'modules';

const setPgToken = () => {
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value): any => {
    localStorage.setItem(key, value);
  });
};

const approval: NextPage<IState> = () => {
  if (typeof window !== 'undefined') {
    setPgToken();
  }
  return (
    <DefaultButton
      types={'primary'}
      onClick={() => {
        //setTimeout 걸어서 닫아도 될듯
        window.close();
      }}
    >
      닫기
    </DefaultButton>
  );
};

export default approval;
