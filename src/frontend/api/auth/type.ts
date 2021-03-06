export interface IGetGiftCardListReqType {}

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
export interface reIssueTokenReqType {
  accessToken: string;
  refreshToken: string;
  isUpdated: boolean;
}
