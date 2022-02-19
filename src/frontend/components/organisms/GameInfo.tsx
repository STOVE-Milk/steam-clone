import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faWindowMaximize, faAppleAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { IState } from 'modules';
import { gameInfo } from 'modules/game/types';
import { getUserData } from 'modules/game';
import { addCartInfo, rmCartInfo } from 'modules/cart';
import { doWish, doUnWish } from 'modules/wishlist';

import { localePrice } from 'util/localeString';

import Text from 'components/atoms/Text';

interface IGameInfo extends gameInfo {
  type?: string;
}

export default function GameInfo(props: IGameInfo) {
  const gameData = props;
  const { userData } = useSelector((state: IState) => state.game);
  const { cartInfo } = useSelector((state: IState) => state.cart);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserData.request({}));
  }, []);

  // [explain]: 현재 like(찜)상태는 스토어에 저장된 userData의 wish_list 배열속에 존재하므로 그 정보와 비교합니다.
  // 마찬가지로, cart(장바구니) 또한 store와 비교합니다.
  const [like, setLike] = useState(false);
  const [cart, setCart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLike(userData.data.wish_list.includes(gameData.id));
    setCart(cartInfo.data.includes(gameData.id));
  }, [userData.data.wish_list, cartInfo.data]);

  //[explain]: 찜 목록과 장바구니에 담는 액션 모두 store에서 관리하기 때문에 dispatch를 진행했습니다.
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
    <GameInfoBox types={gameData.type ? gameData.type : ''}>
      <ImageBox>
        {/* TO DO(양하): 이미지가 없을 때 디폴트 처리{image ? image : <FontAwesomeIcon icon={faImages} />No Image} */}
        <GameImage
          alt={'mainimage'}
          src={`${gameData.image != undefined ? gameData.image.main : ''}`}
          layout={'fill'}
        />
      </ImageBox>
      <GameDetailBox onClick={() => router.push(`game/${gameData.id}`)}>
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
            {/* TO DO(성현 -> 양하): 디비에서 안오는 경우가 있어서 뺴놓음 && 처리해놓음*/}
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
                {/* TO DO(양하): 로그인할 때, 유저 화폐 단위 정보도 가져오기*/}
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
              //[explain]: 유저가 클릭할때, 카드에 담는 액션과 이벤트 버블링이 되는 경우를 막기위해 e.preventDefault()를 적용했습니다.
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

const GameInfoBox = styled.section<{ types: string }>`
  margin-top: ${(props) => props.types === 'cart' && 0} !important;
  width: 60rem;
  height: 10rem;
  display: grid;
  //[explain]:  display: grid에서 사용되는 fr단위입니다.(1fr은 전체를 총 fr단위로 나눴을때 차지하는 한 칸을 의미합니다)
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
  cursor: pointer;

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
