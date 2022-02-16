import { axiosClient } from 'api/axiosClient';
import { IResType, IDoWishReqType, IDoUnWishReqType } from './type';

// 찜 목록 불러오기
export async function getWishListAPI() {
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
