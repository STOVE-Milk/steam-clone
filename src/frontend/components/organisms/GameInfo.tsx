import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken, faImages, faWindowMaximize, faAppleAlt } from '@fortawesome/free-solid-svg-icons';
import sImage from 'public/game.png';
import { IGameInfo } from 'pages/category';
import Text from 'components/atoms/Text';

const GameInfoBox = styled.section`
  border: 1px solid ${(props) => props.theme.colors.divider};
  width: 60rem;
  height: 10rem;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  margin: 0.5rem;
  background: ${(props) => props.theme.colors['secondaryBg']};
  border-radius: 10px;
  ${(props) => props.theme.breakpoints.medium} {
    grid-template-columns: 1.5fr 2fr 0.8fr;
    width: 40rem;
    height: 15rem;
  }
`;
const ImageBox = styled.div`
  /* border: 1px solid ${(props) => props.theme.colors.divider}; */
  margin: 1rem;
  position: relative;
`;
const GameImage = styled(Image)`
  object-fit: cover;
`;
const GameDetailBox = styled.div`
  /* border: 1px solid ${(props) => props.theme.colors.divider}; */
  display: grid;
  grid-template-columns: 3fr 1fr;
  margin: 1rem;
  /* > span {
    display: block;
  } */
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
`;
const EtcInfoBox = styled.div`
  margin: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;
const CenterPosition = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CartInfoBox = styled(CenterPosition)`
  border: 1px solid ${(props) => props.theme.colors.divider};
  width: 100%;
  height: 2.5rem;
  cursor: pointer;
`;
const WishInfoBox = styled(CenterPosition)`
  border: 1px solid ${(props) => props.theme.colors.divider};
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  position: relative;
`;

const SaleBadge = styled(Text).attrs(() => ({
  types: 'large',
}))`
  background-color: ${(props) => props.theme.colors.activeBg};
  width: 4rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: -4rem;
  top: 3rem;
`;

const DefaultPrice = styled(Text).attrs(() => ({
  types: 'small',
}))`
  text-decoration: line-through;
`;

const CategoryBox = styled(Text)`
  display: inline-block;
  padding-right: 0.2rem;
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

// 게임 정보가 담긴 obj {}를 props로 내려주면,
// to do -> 1. 게임정보 타입 정하고 2. props들을 내려주고 3. 제대로 나오나 테스팅하고, 4. 혹시 정보가 없었을 떄 alt로 나오는 정보들이 제대로 나오는지 체크하고
export default function GameInfo(props: IGameInfo) {
  const gameData = props;
  // const [icons, setIcons] = useState('faHeart');
  const [like, setLike] = useState(false);

  return (
    <GameInfoBox>
      {/* image / detail / cart */}
      <ImageBox>
        {/* {image ? image : <FontAwesomeIcon icon={faImages} />No Image} */}
        {/* TO DO(yangha): 게임데이터에서 온 이미지로 변경하기 ->  이미지 url domain 고정되면 config파일도 수정해야함. */}
        <GameImage src={sImage} layout={'fill'}></GameImage>
      </ImageBox>
      {/* 할인중인지 여부에 따라서 ui 가 좀 다름 */}
      {/* 게임 이름 지원 os(icon) 게임 장르 */}
      <GameDetailBox>
        <section className="info">
          <span>
            <Text types="medium">{gameData.name}</Text>
          </span>
          <span>
            {gameData.os.map((eachOs: string) => {
              return eachOs == 'windows' ? (
                <FontAwesomeIcon icon={faWindowMaximize} inverse />
              ) : (
                <FontAwesomeIcon icon={faAppleAlt} inverse />
              );
            })}
          </span>
          <DescriptionBox>{gameData.description_snippet}</DescriptionBox>
          <span>
            {gameData.category_list.map((each: string) => {
              return <CategoryBox>{`#${each}`}</CategoryBox>;
            })}
          </span>
        </section>
        <section className="info">
          <SaleBadge>-10%</SaleBadge>
          <DefaultPrice>{gameData.price.kr}</DefaultPrice>
          <Text types="medium">9000</Text>
        </section>
      </GameDetailBox>
      <EtcInfoBox>
        <CartInfoBox>
          <Text>장바구니에 담기</Text>
        </CartInfoBox>
        <WishInfoBox>
          <span>
            <FontAwesomeIcon icon={like ? faHeart : faHeartBroken} inverse onClick={() => setLike(!like)} />
          </span>
          <div></div>
        </WishInfoBox>
      </EtcInfoBox>
    </GameInfoBox>
  );
}
