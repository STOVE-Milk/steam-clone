export interface IAddGuestBookReqType {
  content: string;
}

export interface IModifyGuestBookReqType {
  content: string;
}

export interface IResType {
  code: number;
  message: string;
  data: any;
}
