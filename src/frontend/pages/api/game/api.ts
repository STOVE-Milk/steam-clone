import axios from 'axios';
import { IGetCategoriesReqType, IGetCategoriesResType } from './type';

export async function getCategoriesAPI(param: IGetCategoriesReqType) {
  const response = await axios.get<IGetCategoriesResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`);
  // const response = await axios.get<IGetCategoriesResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`, {
  //   params: {},
  // });

  return response.data;
}
