import axios from 'axios';
import { axiosClient } from 'api/axiosClient';
import { IGetGameReqType, IResType, IGetGamesByCategoryReqType, IGetGameInfoByIdListReqType } from './type';

export async function getCategoriesAPI() {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/categories`);
  return response.data;
}

export async function getGamesByCategoryAPI(param: IGetGamesByCategoryReqType) {
  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/games?category=${param.category}&page=0&size=5&sort=sale,desc`,
  );
  return response.data;
}

export async function getGameAPI(id: number) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/games/1`);

  return response.data;
}

export async function getGameListAPI(query: string) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/games?${query}`);

  return response.data;
}

export async function getGameInfoByIdListAPI(param: IGetGameInfoByIdListReqType) {
  const convertedParam = param.idList.join(',');
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/cart/${convertedParam}`);
  return response.data;
}

///store/userdata
export async function getUserDataAPI() {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/userdata`);

  return response.data;
}