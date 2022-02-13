import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import { IState } from 'modules';
import { getGameInfoByIdList } from 'modules/game';
import { purchaseGameAPI } from 'api/cart/api';
import { IPurchaseGameReqType } from 'api/cart/type';

import Text from 'components/atoms/Text';
import DefaultButton from 'components/atoms/DefaultButton';
import GameInfo from 'components/organisms/GameInfo';

const cart: NextPage<IState> = (props) => {
  const { cartInfo, gamesByIdList } = useSelector((state: IState) => {
    console.log('카트에 있는 게임 id 배열: ', state.game.cartInfo.data);
    return state.game;
  });
  const [checkedGame, setCheckedGame] = useState([] as number[]); // only 숫자배열

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(getGameInfoByIdList.request({ idList: cartInfo.data }));
  }, []);

  const handleCheckEvt = (game_id: number) => {
    checkedGame.includes(game_id)
      ? setCheckedGame(checkedGame.filter((checkedId) => checkedId !== game_id))
      : setCheckedGame([...checkedGame, game_id]);
  };

  const doPurchase = async () => {
    const checkedGameList: IPurchaseGameReqType[] = [];
    gamesByIdList.data.map((eachGame) => {
      const purchaseGameInfo = {
        id: eachGame.id,
        price: eachGame.price,
        sale: eachGame.sale,
      };
      //아이디가 있는것만 push
      checkedGame.includes(eachGame.id) && checkedGameList.push({ ...purchaseGameInfo });
    });
    const res = await purchaseGameAPI(checkedGameList);

    alert(res.message);
    // code가 77203이면 잔액부족이므로 alert 해주고 충전페이지로 redirect
    if (res.code === 77202) {
      // 지금은 202인테 태현님이 수정 예정임 (계산오류 -> 잔액부족오류)
      router.push('/charge');
    } else {
      router.push('/category'); //일단 있는 페이지로 라우팅시킴
    }
  };

  return (
    <CartInfoWrapper>
      <TitleStyle types="large">카트에 담긴 게임 리스트</TitleStyle>
      {/* TO DO(양하): #1 전체선택, #2 이미 구매목록에 있는 게임이면 카트에 담길수가 없음. */}
      {/* <SelectAllWrapper>
        <input
          type="checkbox"
          id="selectAll"
          name="game"
          // onClick={() => )}
        />
        <label htmlFor="selectAll">
          <Text>전체선택</Text>
        </label>
      </SelectAllWrapper> */}
      {gamesByIdList.data.map((eachGame, i) => {
        return (
          <ChenknGameInfoWrapper>
            <input type="checkbox" id={eachGame.name} name="game" onClick={() => handleCheckEvt(eachGame.id)} />
            <label htmlFor={eachGame.name}>
              <GameInfo key={i} type={'cart'} {...eachGame} />
            </label>
          </ChenknGameInfoWrapper>
        );
      })}
      <DefaultButton types={'primary'} onClick={doPurchase} disabled={checkedGame.length ? false : true}>
        구매하기
      </DefaultButton>
    </CartInfoWrapper>
  );
};

const CartInfoWrapper = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
`;

const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;

const ChenknGameInfoWrapper = styled.div`
  display: flex;
`;

export default cart;
