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

export interface IGetReviewReqType {
  id: number;
}

export interface IAddReviewReqType {
  id: number;
  content: string;
  recommendation: boolean;
}

export interface IModifyReviewReqType {
  id: number;
  reviewId: number;
  content: string;
  recommendation: boolean;
}
