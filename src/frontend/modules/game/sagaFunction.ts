import { IAddCartInfoReqType, IRmCartInfoReqType } from 'pages/api/game/type';

export const addCartToStore = async ({ prev, game_id }: IAddCartInfoReqType) => {
  //중복제거 로직
  const dupArr = [...prev, game_id];
  const set = new Set(dupArr);
  const uniqueArr = [...set];

  return {
    data: uniqueArr,
  };
};
export const rmCartToStore = async ({ prev, game_id }: IRmCartInfoReqType) => {
  //특정 index제거 로직
  const filtered = prev.filter((ele) => ele !== game_id);

  return {
    data: filtered,
  };
};
