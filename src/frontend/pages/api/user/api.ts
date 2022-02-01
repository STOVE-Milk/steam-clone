import axios from 'axios';
import { IDoSignupReqType, IResType } from './type';

export async function doSignupAPI(param: IDoSignupReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup}`, {
    param,
  });
  return response.data;
}

export async function checkEmailAPI(param: IDoSignupReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/email}`, param);
  return response.data;
}
