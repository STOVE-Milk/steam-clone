import React from 'react';
import type { NextPage } from 'next';

import GameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';
import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux';
import { IState } from 'modules';

const CartInfoWrapper = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 2rem;
`;

const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;

const cart: NextPage<IState> = (props) => {
  const { cartInfo } = useSelector((state: IState) => {
    console.log('카드에 있는 게임 id 배열: ', state.game.cartInfo.data);
    return state.game;
  });

  return (
    <CartInfoWrapper>
      <TitleStyle types="large">카트에 담긴 게임 리스트</TitleStyle>
      {/* TODO(양하): 성현님이 게임아이디 배열로 게임정보 불러오는 API 만들어주시면  cartInfo배열 활용해서 정보 뿌려주면됨*/}
      {[].map((eachGame, i) => {
        return <GameInfo key={i} {...eachGame} />;
      })}
    </CartInfoWrapper>
  );
};

export default cart;
