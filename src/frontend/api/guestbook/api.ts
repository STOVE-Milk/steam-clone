import { IAddGuestBookReqType, IModifyGuestBookReqType, IResType } from './type';
import axios from 'axios';

export async function getGuestBooksAPI(userId: number) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${userId}/guest-book`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export async function addGuestBookAPI(userId: number, param: IAddGuestBookReqType) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${userId}/guest-book`,
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

export async function modifyGuestBookAPI(userId: number, bookId: number, param: IModifyGuestBookReqType) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.patch<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${userId}/guest-book/${bookId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      param,
    },
  );

  return response.data;
}
