import { createAsyncAction } from 'typesafe-actions';
import { AxiosError, AxiosResponse } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';
import { IResStoreType } from 'api/game/type';
import { IAddCartInfoReqType, IRmCartInfoReqType } from 'api/cart/type';

export const [ADD_CARTINFO, ADD_CARTINFO_SUCCESS, ADD_CARTINFO_FAIL] = createRequestActionTypes('ADD_CARTINFO');
export const [RM_CARTINFO, RM_CARTINFO_SUCCESS, RM_CARTINFO_FAIL] = createRequestActionTypes('RM_CARTINFO');

export const addCartInfo = createAsyncAction(ADD_CARTINFO, ADD_CARTINFO_SUCCESS, ADD_CARTINFO_FAIL)<
  IAddCartInfoReqType,
  IResStoreType,
  AxiosError
>();

export const rmCartInfo = createAsyncAction(RM_CARTINFO, RM_CARTINFO_SUCCESS, RM_CARTINFO_FAIL)<
  IRmCartInfoReqType,
  IResStoreType,
  AxiosError
>();
