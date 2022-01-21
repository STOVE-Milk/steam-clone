import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';

import { IDoSignupReqType, IResType } from 'pages/api/user/type';

export const [DO_SIGNUP, DO_SIGNUP_SUCCESS, DO_SIGNUP_FAIL] = createRequestActionTypes('DO_SIGNUP');

export const doSignup = createAsyncAction(DO_SIGNUP, DO_SIGNUP_SUCCESS, DO_SIGNUP_FAIL)<
  IDoSignupReqType,
  IResType,
  AxiosError
>();
