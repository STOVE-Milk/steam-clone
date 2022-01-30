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
export interface IGetWishListDataReqType {}
export interface IGetWishListReqType {}

export interface IGetUserDataReqType {}
