import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faWindowMaximize, faAppleAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import sImage from 'public/game.png';
import { IGameInfo } from 'pages/category';
import Text from 'components/atoms/Text';
import { localePrice } from 'util/localeString';

const GameInfoBox = styled.section`
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

// 게임 정보가 담긴 obj {}를 props로 내려주면,
// to do -> 1. 게임정보 타입 정하고 2. props들을 내려주고 3. 제대로 나오나 테스팅하고, 4. 혹시 정보가 없었을 떄 alt로 나오는 정보들이 제대로 나오는지 체크하고
export default function GameInfo(props: IGameInfo) {
  const gameData = props;
  const [like, setLike] = useState(false);
  const [cart, setCart] = useState(false);

  return (
    <GameInfoBox>
      <ImageBox>
        {/* {image ? image : <FontAwesomeIcon icon={faImages} />No Image} */}
        {/* TO DO(yangha): 게임데이터에서 온 이미지로 변경하기 ->  이미지 url domain 고정되면 config파일도 수정해야함. */}

        <GameImage src={sImage} layout={'fill'}></GameImage>
      </ImageBox>
      {/* 할인중인지 여부에 따라서 ui 가 좀 다름 */}
      <GameDetailBox>
        <section className="info">
          <span>
            <Text types="medium">{gameData.name}</Text>
          </span>
          <OsBox>
            {gameData.os.map((eachOs: string) => {
              return <FontAwesomeIcon icon={eachOs === 'windows' ? faWindowMaximize : faAppleAlt} inverse />;
            })}
          </OsBox>
          <DescriptionBox>{gameData.description_snippet}</DescriptionBox>
          <span>
            {gameData.category_list.map((each: string) => {
              return <CategoryBox>{`#${each}`}</CategoryBox>;
            })}
          </span>
        </section>
      </GameDetailBox>
      <EtcInfoBox>
        <section>
          {Boolean(gameData.sale) && <SaleBadge>-{gameData.sale}%</SaleBadge>}
          <div>
            {Boolean(gameData.sale) ? (
              <>
                {/* 로그인할 때, 유저 돈 단위 정보도 가져오기*/}
                <DefaultPrice>{`${localePrice(gameData.price.KR, 'KR')}`}</DefaultPrice>
                <Text types="medium">{`${localePrice((gameData.price.KR / 100) * (100 - gameData.sale), 'KR')}`}</Text>
              </>
            ) : (
              <Text types="medium">{`${localePrice(gameData.price.KR, 'KR')}`}</Text>
            )}
          </div>
        </section>
        <section>
          <IconBox onClick={() => setLike(!like)}>
            <span>
              <FontAwesomeIcon className={like ? '' : 'pink-highlight'} icon={faHeart} inverse />
            </span>
          </IconBox>
          <IconBox onClick={() => setCart(!cart)}>
            <FontAwesomeIcon className={cart ? '' : 'blue-highlight'} icon={faShoppingCart} inverse />
          </IconBox>
        </section>
      </EtcInfoBox>
    </GameInfoBox>
  );
}
