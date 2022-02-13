import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';
import { IDoSignupReqType, IResType, IResStoreType, ISaveUserInfoReqtype } from 'api/user/type';

export const [DO_SIGNUP, DO_SIGNUP_SUCCESS, DO_SIGNUP_FAIL] = createRequestActionTypes('DO_SIGNUP');
export const [SAVE_USERINFO, SAVE_USERINFO_SUCCESS, SAVE_USERINFO_FAIL] = createRequestActionTypes('SAVE_USERINFO');

export const doSignup = createAsyncAction(DO_SIGNUP, DO_SIGNUP_SUCCESS, DO_SIGNUP_FAIL)<
  IDoSignupReqType,
  IResType,
  AxiosError
>();

export const saveUserInfo = createAsyncAction(SAVE_USERINFO, SAVE_USERINFO_SUCCESS, SAVE_USERINFO_FAIL)<
  ISaveUserInfoReqtype,
  IResStoreType,
  AxiosError
>();
