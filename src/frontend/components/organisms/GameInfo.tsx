import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { IState } from 'modules';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faWindowMaximize, faAppleAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Text from 'components/atoms/Text';
import { localePrice } from 'util/localeString';

import { gameInfo } from 'modules/game/types';
import { doWish, doUnWish, getUserData } from 'modules/game';
import { useSelector, useDispatch } from 'react-redux';
import { addCartInfo, rmCartInfo } from 'modules/game';

interface IGameInfo extends gameInfo {
  type?: string;
}

// 게임 정보가 담긴 obj {}를 props로 내려주면,
// to do -> 1. 게임정보 타입 정하고 2. props들을 내려주고 3. 제대로 나오나 테스팅하고, 4. 혹시 정보가 없었을 떄 alt로 나오는 정보들이 제대로 나오는지 체크하고
export default function GameInfo(props: IGameInfo) {
  const gameData = props;
  const { cartInfo, userData } = useSelector((state: IState) => state.game);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData.request({}));
  }, []);

  const likeStatus = userData.data.wish_list != undefined ? userData.data.wish_list.includes(gameData.id) : false;

  const [like, setLike] = useState(likeStatus);
  const [cart, setCart] = useState(false);

  useEffect(() => {
    setCart(cartInfo.data.includes(gameData.id));
  }, []);

  const cartFunc = (game_id: number, curStatus: Boolean) => {
    curStatus ? alert('장바구니에서 빠졌습니다') : alert('장바구니에 담겼습니다.');

    curStatus
      ? dispatch(rmCartInfo.request({ prev: [...cartInfo.data], game_id }))
      : dispatch(addCartInfo.request({ prev: [...cartInfo.data], game_id }));
  };

  const wishFunc = (game_id: number, curStatus: Boolean) => {
    curStatus
      ? dispatch(
          doUnWish.request({
            game_id,
          }),
        )
      : dispatch(
          doWish.request({
            game_id,
          }),
        );
    curStatus ? console.log('un wish') : console.log('wish');
  };

  return (
    <GameInfoBox type={gameData.type}>
      <ImageBox>
        {/* {image ? image : <FontAwesomeIcon icon={faImages} />No Image} */}
        <GameImage
          alt={'mainimage'}
          src={`${gameData.image != undefined ? gameData.image.main : ''}`}
          layout={'fill'}
        />
      </ImageBox>
      <GameDetailBox>
        <section className="info">
          <span>
            <Text types="medium">{gameData.name}</Text>
          </span>
          <OsBox>
            {gameData.os_list.map((eachOs: string) => {
              return (
                <FontAwesomeIcon
                  icon={eachOs.toLocaleLowerCase().indexOf('window') ? faWindowMaximize : faAppleAlt}
                  inverse
                />
              );
            })}
          </OsBox>
          <DescriptionBox>{gameData.description_snippet}</DescriptionBox>
          <span>
            {/*디비에서 안오는 경우가 있어서 뺴놓음 && 처리해놓음 (성현)*/}
            {gameData.category_list &&
              gameData.category_list.map((each: string) => {
                return <CategoryBox>{`#${each}`}</CategoryBox>;
              })}
          </span>
        </section>
      </GameDetailBox>
      <EtcInfoBox>
        <section>
          {gameData.sale != 0 && <SaleBadge>-{gameData.sale}%</SaleBadge>}
          <div>
            {gameData.sale ? (
              <>
                {/* 로그인할 때, 유저 돈 단위 정보도 가져오기*/}
                <DefaultPrice>{`${localePrice(gameData.price, 'KR')}`}</DefaultPrice>
                <Text types="medium">{`${localePrice((gameData.price / 100) * (100 - gameData.sale), 'KR')}`}</Text>
              </>
            ) : (
              <Text types="medium">{`${localePrice(gameData.price, 'KR')}`}</Text>
            )}
          </div>
        </section>
        <section>
          <IconBox
            onClick={(e) => {
              e.preventDefault();
              wishFunc(gameData.id, like);
              setLike(!like);
            }}
          >
            <span>
              <FontAwesomeIcon className={like ? 'pink-highlight' : ''} icon={faHeart} inverse />
            </span>
          </IconBox>
          <IconBox
            onClick={(e) => {
              e.preventDefault();
              console.log(gameData.id, cart);
              cartFunc(gameData.id, cart);
              setCart(!cart);
            }}
          >
            <FontAwesomeIcon className={cart ? 'blue-highlight' : ''} icon={faShoppingCart} inverse />
          </IconBox>
        </section>
      </EtcInfoBox>
    </GameInfoBox>
  );
}

const GameInfoBox = styled.section<IGameInfo>`
  margin-top: ${(props) => props.type === 'cart' && 0} !important;
  width: 60rem;
  height: 10rem;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  margin: 1rem 0.5rem;
  background: ${(props) => props.theme.colors['secondaryBg']};
  border-radius: 10px;
  ${(props) => props.theme.breakpoints.medium} {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    width: 40rem;
    height: fit-content;
  }
  ${(props) => props.theme.breakpoints.small} {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 0.5fr 1.5fr;
    width: 20rem;
  }
`;
const ImageBox = styled.div`
  /* border: 1px solid ${(props) => props.theme.colors.divider}; */
  margin: 1rem;
  position: relative;
  ${(props) => props.theme.breakpoints.medium} {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }
  > span > img {
    border-radius: 10px;
  }
`;
const GameImage = styled(Image)`
  object-fit: cover;
`;
const GameDetailBox = styled.div`
  display: flex;
  margin: 1rem;
  > section {
    display: flex;
    flex-direction: column;
  }
  > section:nth-child(1) {
    justify-content: space-between;
  }
  > section:nth-child(2) {
    position: relative;
    align-items: center;
    justify-content: center;
  }
  ${(props) => props.theme.breakpoints.medium} {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
  }
  ${(props) => props.theme.breakpoints.small} {
    grid-row: 3 / 4;
  }
`;
const EtcInfoBox = styled.div`
  margin: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  > section {
    display: flex;
    align-items: center;

    > div {
      margin-right: 0.5rem;
    }
  }

  ${(props) => props.theme.breakpoints.medium} {
    flex-direction: row;
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }
  ${(props) => props.theme.breakpoints.small} {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
  }
`;
const CenterPosition = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconBox = styled(CenterPosition)`
  border: 1px solid ${(props) => props.theme.colors.divider};
  border-radius: 10px;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  position: relative;

  .pink-highlight {
    color: ${(props) => props.theme.colors.wish};
  }
  .blue-highlight {
    color: ${(props) => props.theme.colors.activeBg};
  }
`;

const SaleBadge = styled(Text).attrs(() => ({
  types: 'large',
}))`
  background-color: ${(props) => props.theme.colors.activeBg};
  border-radius: 10px;

  width: 4rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DefaultPrice = styled(Text).attrs(() => ({
  types: 'small',
}))`
  text-decoration: line-through;
  font-weight: 400;
`;

const CategoryBox = styled(Text)`
  display: inline-block;
  padding-right: 0.2rem;
  color: ${(props) => props.theme.colors.secondaryText};
`;

const DescriptionBox = styled(Text)`
  display: -webkit-box;
  word-wrap: break-word;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3rem;
`;
const PaddingBox = styled.div`
  padding: 1rem;
`;
const OsBox = styled.span`
  > svg {
    margin-right: 0.5rem;
  }
`;
