import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { IState } from 'modules';
import { getWishList } from 'modules/game';
import GameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';

const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;

const wishlist: NextPage<IState> = () => {
  const { wishList } = useSelector((state: IState) => {
    return state.game;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWishList.request({}));
  }, []);

  return (
    <div>
      {console.log(wishList.data)}
      <TitleStyle types="large">WISH 게임 리스트</TitleStyle>
      {wishList.data.map((eachGame) => {
        {
          console.log(eachGame);
        }
        return <GameInfo key={eachGame.id} {...eachGame} />;
      })}
    </div>
  );
};

export default wishlist;
