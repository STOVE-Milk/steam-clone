export interface IGetCategoriesReqType {}

export interface IGetGameReqType {
  id: number;
}

export interface IResStoreType {
  data: any; //API request를 통한 서버응답이 아닌 store만 거치는 경우를 위한 return 타입
}
export interface IResType {
  code: number;
  message: string;
  data: any;
}

export interface IGetGamesByCategoryReqType {
  category: string;
}
export interface IAddCartInfoReqType {
  prev: number[];
  game_id: number;
}
export interface IRmCartInfoReqType {
  prev: number[];
  game_id: number;
}
