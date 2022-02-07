import axios from 'axios';
import { IGetProfileReqType, IGetWithFriendReqType, IResType } from './type';

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
