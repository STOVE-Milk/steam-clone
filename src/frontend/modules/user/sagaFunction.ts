import { ISaveUserInfoReqtype } from 'api/user/type';

export const saveUserInfoToStore = async (data: ISaveUserInfoReqtype) => {
  return {
    data,
  };
};
