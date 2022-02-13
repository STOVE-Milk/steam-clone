export interface IResType {
  code: number;
  message: string;
  data: any;
}

export interface ICheckNicknameReqType {
  nickname: string;
}
export interface ICheckEmailReqType {
  email: string;
}
export interface IDoSignInReqType {
  email: string;
  password: string;
}
export interface IDoSignupReqType {
  email: string;
  password: string;
  username: string;
  nickname: string;
  language: string;
  country: string;
}
export interface ICheckEmailReqtype {
  email: string;
}
