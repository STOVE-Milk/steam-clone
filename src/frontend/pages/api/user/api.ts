import axios from 'axios';
import { axiosClient } from 'pages/api/axiosClient';
import {
  IGetGiftCardListReqType,
  IResType,
  IDoChargeReqType,
  IDoApprovalChargeReqType,
  IDoSignupReqType,
  ICheckEmailReqType,
  IDoSignInReqType,
  ICheckNicknameReqType,
} from './type';

const getToken = () => {
  typeof window !== 'undefined' && localStorage.getItem('accessToken') != null
    ? localStorage.getItem('accessToken')
    : '';
};
export async function getGiftCardListAPI(param: IGetGiftCardListReqType) {
  const token = getToken();
  const response = await axiosClient(token).get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_CHARGE}/payment/giftcards/KR`,
  );

  return response.data;
}

export async function doChargeAPI(param: IDoChargeReqType) {
  const token = getToken();

  const response = await axiosClient(token).post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_CHARGE}/payment/charge/ready`,
    param,
  );
  return response.data;
}

export async function doApprovalChargeAPI(param: IDoApprovalChargeReqType) {
  const token = getToken();

  const response = await axiosClient(token).post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_CHARGE}/payment/charge/approve`,
    param,
  );
  return response.data;
}

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
