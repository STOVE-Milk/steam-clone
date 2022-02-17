import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';
import { IResStoreType, ISaveUserInfoReqtype } from 'api/user/type';
import { IReqType } from 'api/type';
import { IResType } from 'api/friend/type';

export const [SAVE_USERINFO, SAVE_USERINFO_SUCCESS, SAVE_USERINFO_FAIL] = createRequestActionTypes('SAVE_USERINFO');

export const saveUserInfo = createAsyncAction(SAVE_USERINFO, SAVE_USERINFO_SUCCESS, SAVE_USERINFO_FAIL)<
  ISaveUserInfoReqtype,
  IResStoreType,
  AxiosError
>();

export const [GET_FRIEND, GET_FRIEND_SUCCESS, GET_FRIEND_FAIL] = createRequestActionTypes('GET_FRIEND');

export const getFriend = createAsyncAction(GET_FRIEND, GET_FRIEND_SUCCESS, GET_FRIEND_FAIL)<
  IReqType,
  IResType,
  AxiosError
>();

export const [SET_FRIEND_STATUS] = 'SET_FRIEND_STATUS';
