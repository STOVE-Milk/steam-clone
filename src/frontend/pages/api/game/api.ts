import axios from 'axios';
import {
  IGetCategoriesReqType,
  IGetCategoriesResType,
  IGetGamesByCategoryReqType,
  IGetGamesByCategoryResType,
} from './type';

export async function getCategoriesAPI(param: IGetCategoriesReqType) {
  const response = await axios.get<IGetCategoriesResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`);
  // const response = await axios.get<IGetCategoriesResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`, {
  //   params: {},
  // });

  return response.data;
}

export async function getGamesByCategoryAPI({ category }: IGetGamesByCategoryReqType) {
  const response = await axios.get<IGetCategoriesResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/games?category=${category}&page=0&size=5&sort=sale,desc`,
  );

  return response.data;
}
