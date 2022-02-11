import axios from 'axios';
import { axiosClient } from 'pages/api/axiosClient';
import {
  IGetCategoriesReqType,
  IGetGameReqType,
  IResType,
  IGetGamesByCategoryReqType,
  IPurchaseGameReqType,
  IGetGameInfoByIdListReqType,
  IDoWishReqType,
  IGetUserDataReqType,
  IGetWishListReqType,
  IDoUnWishReqType,
} from './type';

export async function getCategoriesAPI(param: IGetCategoriesReqType) {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/categories`);
  // const response = await axios.get<IGetCategoriesResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`, {
  //   params: {},
  // });

  return response.data;
}

export async function getGamesByCategoryAPI(param: IGetGamesByCategoryReqType) {
  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/games?category=${param.category}&page=0&size=5&sort=sale,desc`,
  );
  return response.data;
}

export async function getGameAPI(param: IGetGameReqType) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/detail/${param.id}`);

  return response.data;
}

export async function getGameListAPI(query: string) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/games/?${query}`);

  return response.data;
}

export async function purchaseGameAPI(param: IPurchaseGameReqType[]) {
  const response = await axiosClient.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/payment/cart/purchase`, {
    games: param,
  });

  return response.data;
}

export async function getGameInfoByIdListAPI(param: IGetGameInfoByIdListReqType) {
  const convertedParam = param.idList.join(',');
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/cart/${convertedParam}`);
  return response.data;
}
// 찜 목록 불러오기
export async function getWishListAPI(param: IGetWishListReqType) {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/wishes`);

  return response.data;
}
// 찜 하기
export async function doWishAPI(param: IDoWishReqType) {
  const response = await axiosClient.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STOREL}/store/wishes`, param);

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
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_STORE}/store/userdata`);

  return response.data;
}
