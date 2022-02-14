import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';
import { IResStoreType, ISaveUserInfoReqtype } from 'api/user/type';

export const [SAVE_USERINFO, SAVE_USERINFO_SUCCESS, SAVE_USERINFO_FAIL] = createRequestActionTypes('SAVE_USERINFO');

export const saveUserInfo = createAsyncAction(SAVE_USERINFO, SAVE_USERINFO_SUCCESS, SAVE_USERINFO_FAIL)<
  ISaveUserInfoReqtype,
  IResStoreType,
  AxiosError
>();
