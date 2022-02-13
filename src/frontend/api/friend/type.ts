export interface IResType {
  code: number;
  message: string;
  data: any;
}

export interface ISearchReqType {
  nickname: string;
}

export interface IAcceptFriendReqType {
  request_id: number;
}

export interface ISendFriendReqType {
  user_id: number;
}
