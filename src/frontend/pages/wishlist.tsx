import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useSelector, useDispatch } from 'react-redux';

import { IState } from 'modules';
import { getWishList, getUserData } from 'modules/game';

const wishlist: NextPage<IState> = () => {
  const { wishList, userData, wishListData } = useSelector((state: IState) => {
    // console.log('state:', state);
    return state.game;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getWishList.request({}));
    dispatch(getUserData.request({}));
  }, []);

  return (
    <div>
      {console.log(wishListData)}
      wishlist페이지 입니다.
      {/* 위시리스트 number[]참고해서 게임 정보 뿌려주기 */}
    </div>
  );
};

export default wishlist;
