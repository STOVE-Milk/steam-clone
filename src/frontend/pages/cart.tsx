import React, { useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

import GameInfo from 'components/organisms/GameInfo';
import Text from 'components/atoms/Text';
import DefaultButton from 'components/atoms/DefaultButton';

import { useSelector, useDispatch } from 'react-redux';
import { IState } from 'modules';
import { purchaseGameAPI } from 'pages/api/game/api';
import { IPurchaseGameReqType } from 'pages/api/game/type';
import { CheckBox } from 'components/atoms/CheckBox';

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

const SelectAllWrapper = styled.div`
  display: flex;
`;

const cart: NextPage<IState> = (props) => {
  const { cartInfo, gamesByCategory } = useSelector((state: IState) => {
    console.log('카드에 있는 게임 id 배열: ', state.game.cartInfo.data);
    return state.game;
  });
  const [checkedGame, setCheckedGame] = useState([] as IPurchaseGameReqType[]);
  const checkedGameList: IPurchaseGameReqType[] = [];
  const allGameList: IPurchaseGameReqType[] = [];

  // const allGameList: IPurchaseGameReqType[] = [];
  // const selectAll = (selectAll) => {
  //   const checkboxes = document.querySelectorAll('input[type="checkbox"]');

  //   checkboxes.forEach((checkbox) => {
  //     checkbox.checked = selectAll.checked;
  //   });
  // };
  // const isChecked = (arr: IPurchaseGameReqType[], curId: number) => {
  //   arr.find((each, idx) => {
  //     console.log(each.id, curId);
  //     if (each.id == curId) return true;
  //   });
  //   return false;
  // };

  const doPurchase = async () => {
    const res = await purchaseGameAPI(checkedGameList);
    console.log(res);
  };

  return (
    <CartInfoWrapper>
      <TitleStyle types="large">카트에 담긴 게임 리스트</TitleStyle>
      {console.log(gamesByCategory)}
      {console.log(checkedGameList)}

      {/* TODO(양하): 성현님이 게임아이디 배열로 게임정보 불러오는 API 만들어주시면  cartInfo배열 활용해서 정보 뿌려주면됨*/}
      {/* TO DO(양하): 전체선택 */}
      <SelectAllWrapper>
        <input
          type="checkbox"
          id="selectAll"
          name="game"
          // onClick={() => )}
        />
        <label htmlFor="selectAll">
          <Text>전체선택</Text>
        </label>
      </SelectAllWrapper>
      {gamesByCategory.data.map((eachGame, i) => {
        const purchaseGameInfo = {
          id: eachGame.id,
          price: eachGame.price,
          sale: eachGame.sale,
        };
        allGameList.push(purchaseGameInfo);
        return (
          <>
            <input
              type="checkbox"
              id={eachGame.name}
              name="game"
              onClick={() => {
                checkedGameList.push(purchaseGameInfo);
              }}
            />
            <label htmlFor={eachGame.name}>
              <GameInfo key={i} {...eachGame} />
            </label>
          </>
        );
      })}
      {/* //결제버튼, 체크된 게임 모으기 전에 모든 게임에서 id, price, sale 얻어오는 방법 찾기*/}
      {/* 비어있으면 구매하기 disabled */}
      {console.log(checkedGameList)}
      <DefaultButton types={'primary'} onClick={doPurchase}>
        구매하기
      </DefaultButton>
    </CartInfoWrapper>
  );
};

export default cart;
