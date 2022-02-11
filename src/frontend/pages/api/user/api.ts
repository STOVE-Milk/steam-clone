import axios from 'axios';
import {
  IGetWithFriendReqType,
  IAddGuestBookReqType,
  ISearchReqType,
  IModifyGuestBookReqType,
  IFriendReqType,
  IResType,
} from './type';
import { axiosClient } from 'pages/api/axiosClient';

export async function getProfileAPI(userId: number) {
  const response = await axiosClient.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/profile/${userId}`,
  );

  return response.data;
}

export async function getWithFriendAPI(userId: number) {
  const response = await axiosClient.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/profile/${userId}/friends`,
  );

  return response.data;
}

export async function getGuestBooksAPI(userId: number) {
  const response = await axiosClient.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/profile/${userId}/guest-book`,
  );

  return response.data;
}

export async function addGuestBookAPI(userId: number, param: IAddGuestBookReqType) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/profile/${userId}/guest-book`,
    param,
  );

  return response.data;
}

export async function modifyGuestBookAPI(userId: number, bookId: number, param: IModifyGuestBookReqType) {
  const response = await axiosClient.patch<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/profile/${userId}/guest-book/${bookId}`,
    param,
  );

  return response.data;
}

export async function searchFriendAPI(param: ISearchReqType) {
  const response = await axiosClient.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/search/users?nickname=${param.nickname}`,
  );

  return response.data;
}

export async function getFriendsAPI() {
  const response = await axiosClient.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friends`);

  return response.data;
}

export async function acceptFriendAPI(param: IFriendReqType) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friends`,
    {
      request_id: param.id,
    },
  );

  return response.data;
}

export async function deleteFriendAPI(param: IFriendReqType) {
  const response = await axiosClient.delete<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friends/${param.id}`,
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

export async function deleteFriendRequestAPI(param: IFriendReqType) {
  const response = await axiosClient.delete<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friend-requests/${param.id}`,
  );

  return response.data;
}

export async function sendFriendRequestAPI(param: IFriendReqType) {
  const response = await axiosClient.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL_MEMBERSHIP}/membership/friend-requests`,
    {
      user_id: param.id,
    },
  );

  return response.data;
}
