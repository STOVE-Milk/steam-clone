import { axiosClient } from 'api/axiosClient';
import { IResType, IPurchaseGameReqType } from './type';

export async function purchaseGameAPI(param: IPurchaseGameReqType[]) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_CHARGE}/payment/cart/purchase`,
    {
      games: param,
    },
  );

  return response.data;
}
export async function getWalletInfoAPI() {
  const responnse = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_CHARGE}/payment/wallet`);
  return responnse.data;
}
