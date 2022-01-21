import axios from 'axios';
import { IDoSignupReqType, IResType } from './type';

export async function doSignupAPI(inputs: IDoSignupReqType) {
  const response = await axios.post<IResType>(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/signup}`, {
    params: { inputs },
  });
  return response.data;
}
