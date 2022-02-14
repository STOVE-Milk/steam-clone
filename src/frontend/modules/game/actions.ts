import { createAsyncAction } from 'typesafe-actions';
import { AxiosError, AxiosResponse } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';
import { IReqType } from 'api/type';
import { IResType } from 'api/game/type';

export const [GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL] = createRequestActionTypes('GET_USERDATA');

export const getUserData = createAsyncAction(GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL)<
  IReqType,
  IResType,
  AxiosError
>();
