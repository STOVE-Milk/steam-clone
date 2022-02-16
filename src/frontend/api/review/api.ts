import axios from 'axios';
import { axiosClient } from 'api/axiosClient';

import { IResType } from 'api/review/type';
import { IAddReviewReqType, IModifyReviewReqType } from 'api/review/type';

export async function getReviewAPI(gameId: number) {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/games/${gameId}/reviews`);

  return response.data;
}

export async function addReviewAPI(gameId: number, param: IAddReviewReqType) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/games/${gameId}/reviews`,
    param,
  );

  return response.data;
}

export async function modifyReviewAPI(gameId: number, param: IModifyReviewReqType) {
  const response = await axiosClient.patch<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/games/${gameId}/reviews/${param.review_id}`,
    param,
  );

  return response.data;
}
