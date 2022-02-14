export interface IResType {
  code: number;
  message: string;
  data: any;
}

export interface IAddReviewReqType {
  content: string;
  recommendation: boolean;
}

export interface IModifyReviewReqType {
  review_id: number;
  content: string;
  recommendation: boolean;
}
