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
export interface IResType {
  code: number;
  message: string;
  data: any;
}
export interface IResStoreType {
  data: any; //API request를 통한 서버응답이 아닌 store만 거치는 경우를 위한 return 타입
}
export interface ISaveUserInfoReqtype {
  email: string;
  country: string;
  exp: number;
  iat: number;
  idx: number;
  nickname: string;
  role: number;
}
