export interface IDoSignupReqType {
  email: string;
  password: string;
  username: string;
  nickname: string;
  language: string;
  country: string;
}

export interface IResType {
  code: number;
  message: string;
  payload: any;
}
