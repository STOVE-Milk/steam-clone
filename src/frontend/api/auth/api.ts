import axios from 'axios';
import { IResType } from 'api/game/type';
import {
  IDoSignupReqType,
  ICheckEmailReqType,
  IDoSignInReqType,
  ICheckNicknameReqType,
  reIssueTokenReqType,
} from './type';

export async function doSignupAPI(param: IDoSignupReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_AUTH}/auth/signup`, param);
  return response.data;
}

export async function checkEmailAPI(param: ICheckEmailReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_AUTH}/auth/email`, param);
  return response.data;
}
export async function checkNicknameAPI(param: ICheckNicknameReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_AUTH}/auth/nickname`, param);
  return response.data;
}

export async function doSignInAPI(param: IDoSignInReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_AUTH}/auth/signin`, param);
  return response.data;
}

export async function reIssueTokenAPI(param: reIssueTokenReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_AUTH}/auth/token`, param);
  return response.data;
}
