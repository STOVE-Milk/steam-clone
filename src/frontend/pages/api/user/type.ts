export interface IGetProfileReqType {
  id: number;
}

export interface IGetWithFriendReqType {
  id: number;
}

export interface IGetGuestBooksReqType {
  id: number;
}

export interface IAddGuestBookReqType {
  userId: number;
  content: string;
}

export interface IModifyGuestBookReqType {
  id: number;
  userId: number;
  content: string;
}

export interface IFriendReqType {
  id: number;
}


export interface IResType {
  code: number;
  message: string;
  payload: any;
}
