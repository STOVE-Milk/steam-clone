export interface IResType {
  code: number;
  message: string;
  data: any;
}

export interface IAddReviewReqType {
  content: string;
  recommendation: number;
}

export interface IModifyReviewReqType {
  review_id: number;
  content: string;
  recommendation: number;
}
