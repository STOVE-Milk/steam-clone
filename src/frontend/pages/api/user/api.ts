import axios from 'axios';
import { axiosClient } from '../axiosClient';
import { IDoSignupReqType, IResType, ICheckEmailReqType } from './type';

export async function doSignupAPI(param: IDoSignupReqType) {
  const response = await axiosClient.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup}`, {
    param,
  });
  return response.data;
}

export async function checkEmailAPI(param: ICheckEmailReqType) {
  const response = await axiosClient.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/email}`, param);
  return response.data;
}
