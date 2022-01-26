import axios from 'axios';
import { IGetGiftCardListReqType, IResType } from './type';

export async function getGiftCardListAPI(param: IGetGiftCardListReqType) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_CHARGE}/payment/giftcards/KR`);
  // const response = await axios.get<IGetCategoriesResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`, {
  //   params: {},
  // });

  return response.data;
}
