import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { IState } from 'modules';

import dynamic from 'next/dynamic';

const NoSSRMap = dynamic(() => import('components/organisms/Map'), {
  ssr: false,
});

const library: NextPage<IState> = () => {
  return <NoSSRMap />;
};

export default library;
