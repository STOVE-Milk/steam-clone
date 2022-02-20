import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import type { NextPage } from 'next';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { IState } from 'modules';
import * as WishlistAPI from 'api/wishlist/api'; //getWishList
import { gameInfo } from 'modules/game/types';

import GameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';
import DefaultButton from 'components/atoms/DefaultButton';

const wishlist: NextPage<IState> = () => {
  const [wishList, setWistList] = useState([] as gameInfo[]);
  const router = useRouter();

  useEffect(() => {
    getWishList();
  }, []);

  const getWishList = async () => {
    const res = await WishlistAPI.getWishListAPI();
    const game_list = await res.data.game_list;
    setWistList(game_list);
  };

  return (
    <WishListWrapper>
      <TitleStyle types="large">찜한게임 리스트</TitleStyle>
      <TitleStyle>{': 플레이를 원하는 게임을 구매 전에 미리 찜목록에 담아서 즐겨보세요!'}</TitleStyle>
      {/*TO DO(성현): wishlist가 없으면 데이터가 아예 안와서 Undefined 처리 해놓음! 나중에 빈배열로오면 length 로 고치면 될 듯*/}
      <>
        {wishList === undefined || wishList.length == 0 ? (
          <TitleStyle>
            <FontAwesomeIcon icon={faExclamationTriangle} inverse />
            {' 위시리스트에 담긴 게임이 없습니다. '}
            <RedirectBtn types={'primary'} onClick={() => router.push('/category')}>
              {'게임 담으러 가기'}
            </RedirectBtn>
          </TitleStyle>
        ) : (
          wishList.map((eachGame) => {
            return <GameInfo key={eachGame.id} {...eachGame} show={true} />;
          })
        )}
      </>
    </WishListWrapper>
  );
};
export const RedirectBtn = styled(DefaultButton)`
  margin: 2rem 2rem 2rem 0;
  display: block;
`;
const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;

const WishListWrapper = styled.div`
  width: 60rem;
  margin: 2rem auto;
`;

export default wishlist;
