import axios from 'axios';
import { IGetCategoriesReqType, IGetGameReqType, IResType } from './type';

export async function getCategoriesAPI(param: IGetCategoriesReqType) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`);
  // const response = await axios.get<IGetCategoriesResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`, {
  //   params: {},
  // });

  return response.data;
}

export async function getGameAPI(param: IGetGameReqType) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/detail/${param.id}`);

  return response.data;
}
