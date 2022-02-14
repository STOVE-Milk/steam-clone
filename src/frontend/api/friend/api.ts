import { IAcceptFriendReqType, ISendFriendReqType, IResType } from './type';
import { axiosClient } from 'api/axiosClient';

export async function searchFriendAPI(nickname: string) {
  const response = await axiosClient.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/search/users?nickname=${nickname}`,
  );

  return response.data;
}


export async function getFriendsAPI() {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friends`);

  return response.data;
}

export async function acceptFriendAPI(param: IAcceptFriendReqType) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friends`,
    param,
  );

  return response.data;
}

export async function deleteFriendAPI(id: number) {
  const response = await axiosClient.delete<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friends/${id}`,
  );

  return response.data;
}

export async function getReceivedFriendsAPI() {
  const response = await axiosClient.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friend-requests?type=received`,
  );

  return response.data;
}

export async function getSendedFriendAPI() {
  const response = await axiosClient.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friend-requests?type=sended`,
  );

  return response.data;
}

export async function deleteFriendRequestAPI(id: number) {
  const response = await axiosClient.delete<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friend-requests/${id}`,
  );

  return response.data;
}

export async function sendFriendRequestAPI(param: ISendFriendReqType) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friend-requests`,
    param,
  );
}
