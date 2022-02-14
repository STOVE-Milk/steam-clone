import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';
import { IResType } from 'api/game/type';
import { IDoSignupReqType } from 'api/auth/type';

export const [DO_SIGNUP, DO_SIGNUP_SUCCESS, DO_SIGNUP_FAIL] = createRequestActionTypes('DO_SIGNUP');

export const doSignup = createAsyncAction(DO_SIGNUP, DO_SIGNUP_SUCCESS, DO_SIGNUP_FAIL)<
  IDoSignupReqType,
  IResType,
  AxiosError
>();
