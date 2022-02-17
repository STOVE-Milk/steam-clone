import axios from 'axios';
import { IResType, IPurchaseGameReqType } from './type';

export async function purchaseGameAPI(param: IPurchaseGameReqType[]) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/cart/purchase`, {
    games: param,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
