import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { IState } from 'modules';
import { getUserData } from 'modules/game';
import GameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';

const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;

const wishlist: NextPage<IState> = () => {
  const { wishList } = useSelector((state: IState) => state.game);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData.request({}));
  }, []);

  return (
    <div>
      <TitleStyle types="large">WISH 게임 리스트</TitleStyle>
      {wishList.data.map((eachGame) => {
        return <GameInfo key={eachGame.id} {...eachGame} />;
      })}
    </div>
  );
};

export default wishlist;
