export interface IResType {
  code: number;
  message: string;
  data: any;
}

export interface IAddCartInfoReqType {
  prev: number[];
  game_id: number;
}
export interface IRmCartInfoReqType {
  prev: number[];
  game_id: number;
}
export interface IPurchaseGameReqType {
  id: number;
  price: number;
  sale: number;
}
