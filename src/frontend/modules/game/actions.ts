import { createAsyncAction } from 'typesafe-actions';
import { AxiosError, AxiosResponse } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';
import { IReqType } from 'api/type';
import { IResType, IGetSearchContentReqType } from 'api/game/type';

export const [GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL] = createRequestActionTypes('GET_USERDATA');
export const [GET_SEARCHRESULT, GET_SEARCHRESULT_SUCCESS, GET_SEARCHRESULT_FAIL] =
  createRequestActionTypes('GET_SEARCHRESULT');

export const getUserData = createAsyncAction(GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL)<
  IReqType,
  IResType,
  AxiosError
>();

export const getSearchData = createAsyncAction(GET_SEARCHRESULT, GET_SEARCHRESULT_SUCCESS, GET_SEARCHRESULT_FAIL)<
  IGetSearchContentReqType,
  IResType,
  AxiosError
>();
