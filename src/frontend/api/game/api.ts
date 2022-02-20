import axios from 'axios';
import {
  IGetGameReqType,
  IResType,
  IGetGamesByCategoryReqType,
  IGetGameInfoByIdListReqType,
  IGetSearchContentReqType,
} from './type';

export async function getCategoriesAPI() {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getGamesByCategoryAPI(param: IGetGamesByCategoryReqType) {
  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/games?category=${param.category}&page=0&size=100&sort=sale,desc`,
  );
  return response.data;
}

export async function getGameAPI(id: number) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/games/${id}`);

  return response.data;
}

export async function getGameListAPI(query: string) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/games?${query}`);

  return response.data;
}

export async function getGameInfoByIdListAPI(param: IGetGameInfoByIdListReqType) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/cart${param.idList}`);
  return response.data;
}

///store/userdata -> wish_list, purchase_list 관련임 (유저정보 x)
export async function getUserDataAPI() {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/userdata`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getSearchContentAPI(param: IGetSearchContentReqType) {
  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/search?content=${param.keyword}`,
  );
  return response.data;
}
