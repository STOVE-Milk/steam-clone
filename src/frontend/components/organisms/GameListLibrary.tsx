import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import { IState } from 'modules';
import * as GameAPI from 'api/game/api'; //getGameInfoByIdListAPI
import { gameInfo } from 'modules/game/types';
// import { getUserData } from 'modules/game';
import { isEmpty } from 'util/isEmpty';

import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';

interface IGameListLibararyProps {
  onSelect: (e: any) => void;
  resetSelect: () => void;
  onFinishSetGameOffset: (e: any) => void;
  purchaseList: number[];
}

export const GameListLibrary = (props: IGameListLibararyProps) => {
  const { userInfo } = useSelector((state: IState) => state.user);
  const { userData } = useSelector((state: IState) => state.game); //유저가 가지고있는 게임정보 (wishlist, purchase list)
  const [gamesByIdList, setGamesByIdList] = useState([] as gameInfo[]);
  // const [purchaseList, setPurchaseList] = useState([]);
  const { onSelect, resetSelect, onFinishSetGameOffset, purchaseList } = props;
  const router = useRouter();

  // userData
  const dispatch = useDispatch();

  useEffect(() => {
    // getUserData();
    // dispatch(getUserData.request({}));
    getGamesByIdList();
  }, [purchaseList]);
  // const getUserData = async () => {

  // }
  // const getUserData = async () => {
  //   const res = await GameAPI.getUserDataAPI();
  //   const puchase_list = await res.data.purchase_list;
  //   setPurchaseList(puchase_list);
  // };

  const getGamesByIdList = async () => {
    if (!isEmpty(purchaseList)) {
      const convertedIdList = '/' + purchaseList.join(',');
      const res = await GameAPI.getGameInfoByIdListAPI({ idList: convertedIdList });
      const game_list = await res.data.game_list;
      setGamesByIdList(game_list);
    } else {
      // alert('구매한 게임이 없습니다.');
      let html = document.querySelector('#libraryBox');
      !isEmpty(html) ? (html!.innerHTML = '구매한 게임이 없습니다') : '';
    }
    // const game_list = await res.data!.game_list;
    // setGamesByIdList(game_list);
  };

  return (
    <GameListWrapper>
      {/* 게임의 설치 상태에 따라서 button types를 다르게 */}
      {console.log(purchaseList, gamesByIdList)}
      {gamesByIdList.map((eachGame, i) => {
        return (
          <div>
            <EachGameInfoBox key={i} types="active">
              {eachGame.name}
              <div id="libraryBox">{}</div>
            </EachGameInfoBox>
            <button onClick={() => onSelect(eachGame)}>Select</button>
            <button onClick={() => resetSelect()}>Remove</button>
            <button
              onClick={() => {
                onFinishSetGameOffset(eachGame);
              }}
            >
              Save
            </button>
          </div>
        );
      })}
    </GameListWrapper>
  );
};
export const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;

const GameListWrapper = styled.div`
  /* border: 1px solid black; */
  width: 100%;
`;

const EachGameInfoBox = styled(FilledButton)`
  max-width: 200px;
  display: -webkit-box;
  word-wrap: break-word;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 54px;
`;
