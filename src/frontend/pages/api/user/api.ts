import axios from 'axios';
import { axiosClient } from 'pages/api/axiosClient';
import { IGetGiftCardListReqType, IResType, IDoChargeReqType } from './type';

export async function getGiftCardListAPI(param: IGetGiftCardListReqType) {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_CHARGE}/payment/giftcards/KR`);
  // const response = await axios.get<IGetCategoriesResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`, {
  //   params: {},
  // });

  return response.data;
}

export async function doChargeAPI(param: IDoChargeReqType) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_CHARGE}/payment/charge/ready`,
    param,
  );

  return response.data;
}
