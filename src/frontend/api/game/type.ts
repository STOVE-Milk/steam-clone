export interface IResType {
  code: number;
  message: string;
  data: any;
}

export interface IGetGameReqType {
  id: number;
}

export interface IResStoreType {
  data: any; //API request를 통한 서버응답이 아닌 store만 거치는 경우를 위한 return 타입
}

export interface IGetGamesByCategoryReqType {
  category: string;
}

export interface IGetGameInfoByIdListReqType {
  idList: string;
}
export interface IAddGameOffsetToStore {
  [idx: number]: {
    name: string;
    x: number;
    y: number;
  };
  // prev: {
  //   [idx: number]: {
  //     name: string;
  //     x: number;
  //     y: number;
  //   };
  // };
  // newGameOffset: {
  //   [idx: number]: {
  //     name: string;
  //     x: number;
  //     y: number;
  //   };
  // };
}

export interface IGetGameInfoByUser {
  user_id: string;
}
