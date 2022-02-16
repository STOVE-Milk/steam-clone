import { axiosClient } from 'api/axiosClient';
import { IResType } from 'api/game/type';
import { IGetGiftCardListReqType, IDoChargeReqType, IDoApprovalChargeReqType } from './type';

export async function getGiftCardListAPI(param: IGetGiftCardListReqType) {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/giftcards/KR`);

  return response.data;
}

export async function doChargeAPI(param: IDoChargeReqType) {
  const response = await axiosClient.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/charge/ready`, param);
  return response.data;
}

export async function doApprovalChargeAPI(param: IDoApprovalChargeReqType) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment/charge/approve`,
    param,
  );
  return response.data;
}
