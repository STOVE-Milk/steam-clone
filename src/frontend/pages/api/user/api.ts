import axios from 'axios';
import {
  IAddGuestBookReqType,
  IAcceptFriendReqType,
  IModifyGuestBookReqType,
  ISendFriendReqType,
  IDoSignupReqType,
  ICheckEmailReqType,
  IDoSignInReqType,
  ICheckNicknameReqType,
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

export async function doSignupAPI(param: IDoSignupReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_AUTH}/auth/signup`, param);
  return response.data;
}

export async function checkEmailAPI(param: ICheckEmailReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_AUTH}/auth/email`, param);
  return response.data;
}
export async function checkNicknameAPI(param: ICheckNicknameReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_AUTH}/auth/nickname`, param);
  return response.data;
}

export async function doSignInAPI(param: IDoSignInReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL_AUTH}/auth/signin`, param);
  return response.data;
}
