import { createAsyncAction } from 'typesafe-actions';
import { AxiosError, AxiosResponse } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';
import { IReqType } from 'api/type';
import { IResType, IAddGameOffsetToStore, IResStoreType, IGetGameInfoByUser } from 'api/game/type';

export const [GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL] = createRequestActionTypes('GET_USERDATA');
export const [ADD_GAMEOFFSET, ADD_GAMEOFFSET_SUCCESS, ADD_GAMEOFFSET_FAIL] = createRequestActionTypes('ADD_GAMEOFFSET');
export const [ADD_GAMEINFOBYUSER, ADD_GAMEINFOBYUSER_SUCCESS, ADD_GAMEINFOBYUSER_FAIL] =
  createRequestActionTypes('ADD_GAMEINFOBYUSER');

export const getUserData = createAsyncAction(GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL)<
  IReqType,
  IResType,
  AxiosError
>();

export const addGameOffset = createAsyncAction(ADD_GAMEOFFSET, ADD_GAMEOFFSET_SUCCESS, ADD_GAMEOFFSET_FAIL)<
  IAddGameOffsetToStore,
  IResStoreType,
  AxiosError
>();
export const getGameInfoByUser = createAsyncAction(
  ADD_GAMEINFOBYUSER,
  ADD_GAMEINFOBYUSER_SUCCESS,
  ADD_GAMEINFOBYUSER_FAIL,
)<IGetGameInfoByUser, IResStoreType, AxiosError>();
