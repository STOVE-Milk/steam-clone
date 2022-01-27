import axios from 'axios';
import { axiosClient } from 'pages/api/axiosClient';
import {
  IGetCategoriesReqType,
  IGetGameReqType,
  IResType,
  IGetGamesByCategoryReqType,
  IGetWishListReqType,
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

export async function getWishListAPI(param: IGetWishListReqType) {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/wishes`);

  return response.data;
}
