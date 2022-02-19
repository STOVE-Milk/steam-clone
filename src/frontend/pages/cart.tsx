import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
<<<<<<< HEAD
import { faWallet } from '@fortawesome/free-solid-svg-icons';
=======
import { faExclamationTriangle, faWallet } from '@fortawesome/free-solid-svg-icons';
>>>>>>> 54ed82ac53223cee7bc6e26dece42035cda9f8bd

import { IState } from 'modules';
import * as GameAPI from 'api/game/api';
import * as CartAPI from 'api/cart/api'; //purchaseGameAPI
import { gameInfo } from 'modules/game/types';
import { IPurchaseGameReqType } from 'api/cart/type';
import { isEmpty } from 'util/isEmpty';
import { localePrice } from 'util/localeString';

import Text from 'components/atoms/Text';
import DefaultButton from 'components/atoms/DefaultButton';
import GameInfo from 'components/organisms/GameInfo';
import { RedirectBtn } from 'pages/wishlist';
import { verifyToken } from 'util/verifyToken';

const cart: NextPage<IState> = (props) => {
  const { cartInfo } = useSelector((state: IState) => state.cart);
  const { userData } = useSelector((state: IState) => state.game);
  const [gameList, setGameList] = useState([] as gameInfo[]);
  const [checkedGame, setCheckedGame] = useState([] as number[]); // 체크된 게임은 number[] 타입으로 관리
  const [walletInfo, setWalletInfo] = useState(0 as number);

  const router = useRouter();

  useEffect(() => {
<<<<<<< HEAD
=======
    verifyToken();
>>>>>>> 54ed82ac53223cee7bc6e26dece42035cda9f8bd
    getWalletInfo();
    getGamesByIdList();
  }, []);

  const getWalletInfo = async () => {
    const res = await CartAPI.getWalletInfoAPI();
    const money = await res.data.money;
    setWalletInfo(money);
  };

  const getGamesByIdList = async () => {
    if (!isEmpty(cartInfo.data)) {
      const convertedParam = '/' + cartInfo.data.join(',');
      const res = await GameAPI.getGameInfoByIdListAPI({ idList: convertedParam });
      const game_list = await res.data.game_list;
      setGameList(game_list);
    } else {
      // alert('카트에 담긴 게임이 없습니다.');
      // router.push('/category');
    }
  };

  const handleCheckEvt = (game_id: number) => {
    checkedGame.includes(game_id)
      ? setCheckedGame(checkedGame.filter((checkedId) => checkedId !== game_id))
      : setCheckedGame([...checkedGame, game_id]);
  };

  const doPurchase = async () => {
    const checkedGameList: IPurchaseGameReqType[] = [];
    gameList.map((eachGame) => {
      const purchaseGameInfo = {
        id: eachGame.id,
        price: eachGame.price,
        sale: eachGame.sale,
      };
      //아이디가 있는것만 push
      checkedGame.includes(eachGame.id) && checkedGameList.push({ ...purchaseGameInfo });
    });
    const res = await CartAPI.purchaseGameAPI(checkedGameList);

    alert(res.message);
    // code가 77203이면 잔액부족이므로 alert 해주고 충전페이지로 redirect
    if (res.code === 77203) {
<<<<<<< HEAD
      // 지금은 202인테 태현님이 수정 예정임 (계산오류 -> 잔액부족오류)
=======
>>>>>>> 54ed82ac53223cee7bc6e26dece42035cda9f8bd
      router.push('/charge');
    } else {
      router.push('/category'); //일단 있는 페이지로 라우팅시킴
    }
  };

  return (
    <CartInfoWrapper>
<<<<<<< HEAD
      <WalletInfoWrapper>
        <FontAwesomeIcon icon={faWallet} inverse />
        <TitleStyle types="large">{`나의 잔액: ${localePrice(walletInfo, 'KR')}`}</TitleStyle>
      </WalletInfoWrapper>
      <TitleStyle types="large">카트에 담긴 게임 리스트</TitleStyle>
=======
      {console.log(gameList)}
      <TitleStyle types="large">장바구니에 담긴 게임 리스트</TitleStyle>
      <TitleStyle>{': 플레이를 원하는 게임을 선택해서 "구매하기"를 진행해보세요!'}</TitleStyle>

      <WalletInfoWrapper>
        <FontAwesomeIcon icon={faWallet} inverse />
        <TitleStyle types="large">{`나의 잔액: ${localePrice(walletInfo, 'KR', 'charge')} `}</TitleStyle>
      </WalletInfoWrapper>
>>>>>>> 54ed82ac53223cee7bc6e26dece42035cda9f8bd
      {/* TO DO(양하): #1 전체선택(React에서 input태그의 checked처리 확인), #2 이미 구매목록에 있는 게임이면 카트에 담길수가 없음. */}
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
      <div>
        {gameList.length === 0 ? (
          <TitleStyle>
            <FontAwesomeIcon icon={faExclamationTriangle} inverse />
            {' 장바구니에 담긴 게임이 없습니다. '}
            <RedirectBtn types={'primary'} onClick={() => router.push('/category')}>
              {'게임 담으러 가기'}
            </RedirectBtn>
          </TitleStyle>
        ) : (
          gameList.map((eachGame, i) => {
            if (!userData.data.purchase_list.includes(eachGame.id)) {
              return (
                <>
                  <ChenknGameInfoWrapper key={eachGame + i.toString()}>
                    <input type="checkbox" id={eachGame.name} name="game" onClick={() => handleCheckEvt(eachGame.id)} />
                    <label htmlFor={eachGame.name}>
                      <GameInfo key={eachGame.id} type={'cart'} {...eachGame} />
                    </label>
                  </ChenknGameInfoWrapper>
                  <Purchasebtn types={'primary'} onClick={doPurchase} disabled={checkedGame.length ? false : true}>
                    구매하기
                  </Purchasebtn>
                </>
              );
            }
          })
        )}
      </div>
    </CartInfoWrapper>
  );
};

<<<<<<< HEAD
=======
const Purchasebtn = styled(DefaultButton)`
  position: sticky;
  bottom: 20px;
  width: 60rem;
  margin: 2rem;
  ${(props) => props.theme.breakpoints.medium} {
    width: 40rem;
  }
  ${(props) => props.theme.breakpoints.small} {
    width: 20rem;
  }
`;
>>>>>>> 54ed82ac53223cee7bc6e26dece42035cda9f8bd
const WalletInfoWrapper = styled.div`
  display: flex;
  align-items: baseline;
  > div {
    margin-left: 0.5rem;
  }
`;

const CartInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
  width: 60rem;
`;

const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;

const ChenknGameInfoWrapper = styled.div`
  display: flex;
`;

export default cart;
