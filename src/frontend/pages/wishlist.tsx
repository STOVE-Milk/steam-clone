import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useSelector, useDispatch } from 'react-redux';

import { IState } from 'modules';
import { getWishList } from 'modules/game';

const wishlist: NextPage<IState> = () => {
  const { wishList } = useSelector((state: IState) => {
    // console.log('state:', state);
    return state.game;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWishList.request({}));
  }, []);

  return (
    <div>
      {console.log(wishList)}
      wishlist페이지 입니다.
    </div>
  );
};

export default wishlist;
