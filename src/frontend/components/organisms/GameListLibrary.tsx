import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import { IState } from 'modules';
import * as GameAPI from 'api/game/api'; //getGameInfoByIdListAPI
import { gameInfo } from 'modules/game/types';
// import { getUserData } from 'modules/game';
import { isEmpty } from 'util/isEmpty';

import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import { doSignInAPI } from 'api/auth/api';

interface IGameListLibararyProps {
  onSelect: (e: any) => void;
  resetSelect: () => void;
  onFinishSetGameOffset: (e: any) => void;
  purchaseList: number[];
  installedGameList: gameInfo[];
}
//나 === url 위치가 같을 때만 부르면 됨
export const GameListLibrary = (props: IGameListLibararyProps) => {
  const { userInfo } = useSelector((state: IState) => state.user);
  const { onSelect, resetSelect, onFinishSetGameOffset, purchaseList, installedGameList } = props;

  const [gamesByIdList, setGamesByIdList] = useState([] as gameInfo[]);
  const router = useRouter();

  useEffect(() => {
    getGamesByIdList();
  }, [purchaseList]);

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
  };

  return (
    <GameListWrapper>
      {/* 게임의 설치 상태에 따라서 button types를 다르게 */}
      {console.log(purchaseList, gamesByIdList)}
      <SubTitleStyle types="medium">{'구매한 게임 목록'}</SubTitleStyle>
      {/* true : 나의 라이브러리 / false: 친구의 라이브러리 */}
      {router.query.id == userInfo.data.idx.toString()
        ? gamesByIdList.map((eachGame, i) => {
            return (
              <GameListItemWrapper>
                <EachGameInfoBox key={i} types="secondary" onClick={() => onSelect(eachGame)}>
                  {eachGame.name}
                </EachGameInfoBox>
                {/* <div id="libraryBox">{}</div> */}

                {/* <button onClick={() => onSelect(eachGame)}>Select</button> */}
                <FaIconWrapper>
                  {/* <FontAwesomeIconStyle icon={faTimes} onClick={() => resetSelect()} inverse></FontAwesomeIconStyle> */}
                  <FontAwesomeIconStyle
                    icon={faCheck}
                    onClick={() => {
                      onFinishSetGameOffset(eachGame);
                    }}
                    inverse
                  ></FontAwesomeIconStyle>
                </FaIconWrapper>
              </GameListItemWrapper>
            );
          })
        : installedGameList &&
          installedGameList.map((eachGame, i) => {
            return (
              <GameListItemWrapperNoClick>
                <EachGameInfoBox key={i} types="secondary">
                  {eachGame.name}
                </EachGameInfoBox>
              </GameListItemWrapperNoClick>
            );
          })}
    </GameListWrapper>
  );
};
export const TitleStyle = styled(Text)`
  margin-bottom: 2rem;
`;
const SubTitleStyle = styled(Text)`
  margin-left: 1rem;
  margin-bottom: 1rem;
`;
const FaIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const GameListItemWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const GameListItemWrapperNoClick = styled(GameListItemWrapper)`
  pointer-events: none;
`;

const GameListWrapper = styled.div`
  /* border: 1px solid black; */
  width: 100%;
`;

const EachGameInfoBox = styled(FilledButton)`
  width: 200px;
  display: -webkit-box;
  word-wrap: break-word;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 54px;
  margin-bottom: 1rem;
`;
const FontAwesomeIconStyle = styled(FontAwesomeIcon)`
  cursor: pointer;
  margin-right: 0.5rem;
`;
