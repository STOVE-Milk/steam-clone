import axios from 'axios';
import { IResType, IDoWishReqType, IDoUnWishReqType } from './type';

// 찜 목록 불러오기
export async function getWishListAPI() {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/wishes`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
// 찜 하기
export async function doWishAPI(param: IDoWishReqType) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/wishes`, param, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
// 찜 취소하기 /store/wishes/{game_id}
export async function doUnWishAPI(param: IDoUnWishReqType) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.delete<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/store/wishes/${param.game_id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
