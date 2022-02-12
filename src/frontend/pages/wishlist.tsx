import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { IState } from 'modules';
import { getWishList } from 'modules/game';
import GameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';

const wishlist: NextPage<IState> = () => {
  const { wishList } = useSelector((state: IState) => state.game);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWishList.request({}));
  }, []);
  return (
    <WishListWrapper>
      <TitleStyle types="large">WISH 게임 리스트</TitleStyle>
      {/*(성현) wishlist가 없으면 데이터가 아예 안와서 Undefined 처리 해놓음! 나중에 빈배열로오면 length 로 고치면 될 듯*/}
      {wishList.data === undefined
        ? 'no wishdata'
        : wishList.data.map((eachGame) => {
            return <GameInfo key={eachGame.id} {...eachGame} />;
          })}
    </WishListWrapper>
  );
};
const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;

const WishListWrapper = styled.div`
  width: 80%;
  margin: 2rem auto;
`;

export default wishlist;
