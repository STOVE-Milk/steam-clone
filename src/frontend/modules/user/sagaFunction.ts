import { ISaveUserInfoReqtype } from 'pages/api/user/type';

export const saveUserInfoToStore = async (data: ISaveUserInfoReqtype) => {
  return {
    data,
  };
};
