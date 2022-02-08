import axios from 'axios';
import { axiosClient } from 'pages/api/axiosClient';
import {
  IGetCategoriesReqType,
  IGetGameReqType,
  IResType,
  IGetGamesByCategoryReqType,
  IPurchaseGameReqType,
  IGetGameInfoByIdListReqType,
} from './type';

export async function getCategoriesAPI(param: IGetCategoriesReqType) {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`);
  // const response = await axios.get<IGetCategoriesResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`, {
  //   params: {},
  // });

  return response.data;
}

export async function getGamesByCategoryAPI(param: IGetGamesByCategoryReqType) {
  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/games?category=${param.category}&page=0&size=5&sort=sale,desc`,
  );
  return response.data;
}

export async function getGameAPI(param: IGetGameReqType) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/detail/${param.id}`);

  return response.data;
}

export async function purchaseGameAPI(param: IPurchaseGameReqType[]) {
  const response = await axiosClient.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/payment/cart/purchase`, {
    games: param,
  });

  return response.data;
}

export async function getGameInfoByIdListAPI(param: IGetGameInfoByIdListReqType) {
  const convertedParam = param.idList.join(',');
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/cart/${convertedParam}`);

  return response.data;
}
