import { IAddGuestBookReqType, IModifyGuestBookReqType, IResType } from './type';
import { axiosClient } from 'api/axiosClient';

export async function getGuestBooksAPI(userId: number) {
  const response = await axiosClient.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${userId}/guest-book`,
  );

  return response.data;
}

export async function addGuestBookAPI(userId: number, param: IAddGuestBookReqType) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${userId}/guest-book`,
    param,
  );

  return response.data;
}

export async function modifyGuestBookAPI(userId: number, bookId: number, param: IModifyGuestBookReqType) {
  const response = await axiosClient.patch<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${userId}/guest-book/${bookId}`,
    param,
  );

  return response.data;
}
