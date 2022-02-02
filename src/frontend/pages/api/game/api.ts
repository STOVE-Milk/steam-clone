import axios from 'axios';
import {
  IGetCategoriesReqType,
  IGetGameReqType,
  IResType,
  IGetGamesByCategoryReqType,
  IGetReviewReqType,
  IAddReviewReqType,
  IModifyReviewReqType,
} from './type';

export async function getCategoriesAPI(param: IGetCategoriesReqType) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`);
  // const response = await axios.get<IGetCategoriesResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/categories`, {
  //   params: {},
  // });
  // console.log(response.data);
  return response.data;
}

export async function getGamesByCategoryAPI(param: IGetGamesByCategoryReqType) {
  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/games?category=${param.category}&page=0&size=5&sort=sale,desc`,
  );
  return response.data;
}

export async function getGameAPI(param: IGetGameReqType) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/games/${param.id}`);

  return response.data;
}

export async function getReviewAPI(param: IGetReviewReqType) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/games/${param.id}/reviews`);

  return response.data;
}

export async function addReviewAPI(param: IAddReviewReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/games/${param.id}/reviews`, {
    params: {
      content: param.content,
      recommendation: param.recommendation,
    },
  });

  return response.data;
}

export async function modifyReviewAPI(param: IModifyReviewReqType) {
  const response = await axios.patch<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/games/${param.id}/reviews/${param.reviewId}`,
    {
      params: {
        review_id: param.reviewId,
        content: param.content,
        recommendation: param.recommendation,
      },
    },
  );

  return response.data;
}
