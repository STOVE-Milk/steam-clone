export interface IGetWithFriendReqType {
  id: number;
}

export interface IAddGuestBookReqType {
  content: string;
}

export interface ISearchReqType {
  nickname: string;
}

export interface IModifyGuestBookReqType {
  content: string;
}

export interface IFriendReqType {
  id: number;
}

export interface IResType {
  code: number;
  message: string;
  data: any;
}
