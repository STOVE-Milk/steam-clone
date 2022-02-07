import axios from 'axios';
import {
  IGetProfileReqType,
  IGetWithFriendReqType,
  IGetGuestBooksReqType,
  IAddGuestBookReqType,
  IModifyGuestBookReqType,
  IResType,
} from './type';

export async function getProfileAPI(param: IGetProfileReqType) {
  const response = await axios.get<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${param.id}`);

  return response.data;
}

export async function getWithFriendAPI(param: IGetWithFriendReqType) {
  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${param.id}/friends`,
  );

  return response.data;
}

export async function getGuestBooksAPI(param: IGetGuestBooksReqType) {
  const response = await axios.get<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${param.id}/guest-book`,
  );

  return response.data;
}

export async function addGuestBookAPI(param: IAddGuestBookReqType) {
  const response = await axios.post<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${param.userId}/guest-book`,
    {
      params: {
        content: param.content,
      },
    },
  );

  return response.data;
}

export async function modifyGuestBookAPI(param: IModifyGuestBookReqType) {
  const response = await axios.patch<IResType>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/membership/profile/${param.userId}/guest-book/${param.id}`,
    {
      params: {
        content: param.content,
      },
    },
  );

  return response.data;
}
