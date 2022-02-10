export interface IGetCategoriesReqType {}

export interface IGetGameReqType {
  id: number;
}

export interface IResType {
  code: number;
  message: string;
  data: any;
}

export interface IGetGamesByCategoryReqType {
  category: string;
}
export interface IGetWishListReqType {}
export interface IDoWishReqType {
  game_id: number;
}
export interface IDoUnWishReqType {
  game_id: number;
}

export interface IGetUserDataReqType {}
