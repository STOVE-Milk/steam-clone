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
  //이게 맞나? 하드코딩하는것같아서 화가나는군
  const doWishFunc = (game_id: number) => {
    console.log('do wish', game_id);
    dispatch(
      doWish.request({
        game_id: game_id,
      }),
    );
  };

  const doUnWishFunc = (game_id: number) => {
    console.log('do unwish', game_id);
    dispatch(
      doUnWish.request({
        game_id: game_id,
      }),
    );
  };
  return (
    <div>
      {/* {console.log(unWish.data)} */}
      <TitleStyle types="large">WISH 게임 리스트</TitleStyle>

      {wishList.data.map((eachGame) => {
        const wishController = {
          doWishFunc,
          doUnWishFunc,
        };
        return <GameInfo key={eachGame.id} {...eachGame} wishFunc={wishController} />;
      })}
    </div>
  );
};

export default wishlist;
