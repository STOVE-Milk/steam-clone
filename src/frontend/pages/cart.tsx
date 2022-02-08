import React, { useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

import GameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';
import DefaultButton from 'components/atoms/DefaultButton';

import { useSelector, useDispatch } from 'react-redux';
import { IState } from 'modules';
import { purchaseGameAPI } from 'pages/api/game/api';

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
  const { cartInfo, gamesByCategory } = useSelector((state: IState) => {
    console.log('카드에 있는 게임 id 배열: ', state.game.cartInfo.data);
    return state.game;
  });
  // const [checkedGame, setCheckedGame] = useState([]);
  const checkedGameList = [];

  const doPurchase = async () => {
    const res = await purchaseGameAPI(checkedGameList);
    //   [
    //   {
    //     id: 1,
    //     price: 10000,
    //     sale: 10,
    //   },
    //   {
    //     id: 2,
    //     price: 10000,
    //     sale: 10,
    //   },
    // ]
    console.log(res);
  };

  return (
    <CartInfoWrapper>
      <TitleStyle types="large">카트에 담긴 게임 리스트</TitleStyle>
      {console.log(gamesByCategory)}
      {/* TODO(양하): 성현님이 게임아이디 배열로 게임정보 불러오는 API 만들어주시면  cartInfo배열 활용해서 정보 뿌려주면됨*/}
      {/* //전체선택 */}
      {gamesByCategory.data.map((eachGame, i) => {
        const purchaseGameInfo = {
          id: eachGame.id,
          price: eachGame.price,
          sale: eachGame.sale,
        };
        checkedGameList.push(purchaseGameInfo);
        return (
          <>
            <input type="checkbox" id={eachGame.name} name="game" />
            <label htmlFor={eachGame.name}>
              <GameInfo key={i} {...eachGame} />
            </label>
          </>
        );
      })}
      {/* //결제버튼, 체크된 게임 모으기 전에 모든 게임에서 id, price, sale 얻어오는 방법 찾기*/}
      <DefaultButton types={'primary'} onClick={doPurchase}>
        구매하기
      </DefaultButton>
    </CartInfoWrapper>
  );
};

export default cart;
