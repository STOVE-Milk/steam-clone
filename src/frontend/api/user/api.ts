import axios from 'axios';
import { IResType } from './type';

export async function getProfileAPI(userId: number) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${userId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getWithFriendAPI(userId: number) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${userId}/friends`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}
