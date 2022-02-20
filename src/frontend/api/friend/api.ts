import axios from 'axios';

import { IAcceptFriendReqType, ISendFriendReqType, IResType } from './type';

export async function searchFriendAPI(nickname: string) {
  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/search/users?nickname=${nickname}`,
  );

  return response.data;
}

export async function getFriendsAPI() {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/membership/friends`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function acceptFriendAPI(param: IAcceptFriendReqType) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/membership/friends`, param, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteFriendAPI(id: number) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.delete<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/membership/friends/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getReceivedFriendsAPI() {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/friend-requests?type=received`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export async function getSendedFriendAPI() {
  const token = localStorage.getItem('accessToken');

  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/friend-requests?type=sended`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export async function deleteFriendRequestAPI(id: number) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.delete<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/friend-requests/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export async function sendFriendRequestAPI(param: ISendFriendReqType) {
  const token = localStorage.getItem('accessToken');

  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/membership/friend-requests`, param, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}
