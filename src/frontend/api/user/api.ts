import axios from 'axios';
import { IResType } from './type';
import { axiosClient } from 'api/axiosClient';

export async function getProfileAPI(userId: number) {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${userId}`);

  return response.data;
}

export async function getWithFriendAPI(userId: number) {
  const response = await axiosClient.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${userId}/friends`,
  );

  return response.data;
}
