import React, { useState, useEffect } from 'react';
import FilledButton from 'components/atoms/FilledButton';
import type { NextPage } from 'next';
import { IState } from 'modules';

const approval: NextPage<IState> = () => {
  return <FilledButton types={'primary'}>닫기</FilledButton>;
};

export default approval;
