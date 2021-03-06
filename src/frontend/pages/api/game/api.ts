import axios from 'axios';
import { axiosClient } from 'pages/api/axiosClient';
import {
  IGetCategoriesReqType,
  IGetGameReqType,
  IResType,
  IGetGamesByCategoryReqType,
  IDoWishReqType,
  IGetUserDataReqType,
  IGetWishListReqType,
  IDoUnWishReqType,
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
// 찜 목록 불러오기
export async function getWishListAPI(param: IGetWishListReqType) {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/wishes`);

  return response.data;
}
// 찜 하기
export async function doWishAPI(param: IDoWishReqType) {
  const response = await axiosClient.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/wishes`, param);

  return response.data;
}
// 찜 취소하기 /store/wishes/{game_id}
export async function doUnWishAPI(param: IDoUnWishReqType) {
  const response = await axiosClient.delete<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/wishes/${param.game_id}`,
  );

  return response.data;
}
///store/userdata
export async function getUserDataAPI(param: IGetUserDataReqType) {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/userdata`);

  return response.data;
}
export async function getGameInfoByIdListAPI(param: IGetGameInfoByIdListReqType) {
  const convertedParam = param.idList.join(',');
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/cart/${convertedParam}`);

  return response.data;
}
