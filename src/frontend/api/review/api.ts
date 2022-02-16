import axios from 'axios';

import { IResType } from 'api/review/type';
import { IAddReviewReqType, IModifyReviewReqType } from 'api/review/type';

export async function getReviewAPI(gameId: number) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get<IResType>(`${NEXT_PUBLIC_BASE_URL}/store/games/${gameId}/reviews`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function addReviewAPI(gameId: number, param: IAddReviewReqType) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.post<IResType>(`${NEXT_PUBLIC_BASE_URL}/store/games/${gameId}/reviews`, param, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function modifyReviewAPI(gameId: number, param: IModifyReviewReqType) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.patch<IResType>(
    `${NEXT_PUBLIC_BASE_URL}/store/games/${gameId}/reviews/${param.review_id}`,
    param,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}
