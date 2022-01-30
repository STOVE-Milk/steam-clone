import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { IState } from 'modules';
import { doWish, doUnWish, getUserData } from 'modules/game';
import GameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';

const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;

const wishlist: NextPage<IState> = () => {
  const { wishList, wish, unWish } = useSelector((state: IState) => {
    // console.log('state:', state);
    return state.game;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getWishList.request({}));
    dispatch(getUserData.request({}));
  }, []);

  const wishFunc = (game_id: number, curStatus: Boolean) => {
    curStatus
      ? dispatch(
          doUnWish.request({
            game_id,
          }),
        )
      : dispatch(
          doWish.request({
            game_id,
          }),
        );
  };

  return (
    <div>
      <TitleStyle types="large">WISH 게임 리스트</TitleStyle>
      {wishList.data.map((eachGame) => {
        return <GameInfo key={eachGame.id} {...eachGame} wishFunc={wishFunc} />;
      })}
    </div>
  );
};

export default wishlist;
