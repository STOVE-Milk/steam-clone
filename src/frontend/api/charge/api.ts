import axios from 'axios';
import { IResType } from 'api/game/type';
import { IGetGiftCardListReqType, IDoChargeReqType, IDoApprovalChargeReqType } from './type';
import { verifyToken } from '../../util/verifyToken';

export async function getGiftCardListAPI(param: IGetGiftCardListReqType) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/giftcards/KR`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function doChargeAPI(param: IDoChargeReqType) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/charge/ready`, param, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function doApprovalChargeAPI(param: IDoApprovalChargeReqType) {
  verifyToken();
  const token = localStorage.getItem('accessToken');

  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/charge/approve`, param, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
