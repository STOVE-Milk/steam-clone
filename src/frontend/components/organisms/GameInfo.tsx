import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken, faImages, faWindowMaximize, faAppleAlt } from '@fortawesome/free-solid-svg-icons';
import sImage from 'public/sampleImg.jpeg';
import { IGameInfo } from 'pages/category';

type GameInfoText = {};

const GameInfoWrapper = styled.section`
  border: 1px solid ${(props) => props.theme.colors.divider};
  width: 60rem;
  height: 10rem;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  margin: 10px;
`;
const ImageBox = styled.div`
  border: 1px solid ${(props) => props.theme.colors.divider};
  margin: 1rem;
`;
const GameDetailBox = styled.div`
  border: 1px solid ${(props) => props.theme.colors.divider};
  margin: 1rem;
  > span {
    display: block;
  }
`;
const EtcInfoBox = styled.div`
  /* border: 1px solid ${(props) => props.theme.colors.divider}; */
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
`;

// 게임 정보가 담긴 obj {}를 props로 내려주면,
// to do -> 1. 게임정보 타입 정하고 2. props들을 내려주고 3. 제대로 나오나 테스팅하고, 4. 혹시 정보가 없었을 떄 alt로 나오는 정보들이 제대로 나오는지 체크하고
export default function GameInfo(props: IGameInfo) {
  const gameData = props;
  return (
    <GameInfoWrapper>
      {/* image / detail / cart */}
      <ImageBox>
        {/* {image ? image : <FontAwesomeIcon icon={faImages} />No Image} */}
        {/* TO DO(yangha): 게임데이터에서 온 이미지로 변경하기 ->  이미지 url domain 고정되면 config파일도 수정해야함. */}
        <Image src={sImage} layout={'responsive'}></Image>
      </ImageBox>
      {/* 할인중인지 여부에 따라서 ui 가 좀 다름 */}
      {/* 게임 이름 지원 os(icon) 게임 장르 */}
      <GameDetailBox>
        <span>{gameData.name}</span>
        <span>
          {gameData.os.map((eachOs: string) => {
            return eachOs == 'windows' ? (
              <FontAwesomeIcon icon={faWindowMaximize} />
            ) : (
              <FontAwesomeIcon icon={faAppleAlt} />
            );
          })}
        </span>
        <span>
          {gameData.gameCategory.map((each: string) => {
            return `#${each} `;
          })}
        </span>
      </GameDetailBox>
      <EtcInfoBox>
        <CartInfoBox>장바구니에 담기</CartInfoBox>

        <WishInfoBox>
          <FontAwesomeIcon icon={faHeartBroken} />
        </WishInfoBox>
      </EtcInfoBox>
    </GameInfoWrapper>
  );
}
