import axios from 'axios';
import { axiosClient } from 'pages/api/axiosClient';
import { IGetGiftCardListReqType, IResType, IDoChargeReqType, IDoApprovalChargeReqType } from './type';

export async function getGiftCardListAPI(param: IGetGiftCardListReqType) {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_CHARGE}/payment/giftcards/KR`);

  return response.data;
}

export async function doChargeAPI(param: IDoChargeReqType) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_CHARGE}/payment/charge/ready`,
    param,
  );
}

export async function doApprovalChargeAPI(param: IDoApprovalChargeReqType) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_CHARGE}/payment/charge/approve`,
    param,
  );

  return response.data;
}
