import { createAsyncAction, createAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from '../utils/actionUtils';

import { IGetCategoriesReqType, IGetGameReqType, IResType } from 'pages/api/game/type';

export const [GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL] = createRequestActionTypes('GET_CATEGORIES');
export const [GET_GAME, GET_GAME_SUCCESS, GET_GAME_FAIL] = createRequestActionTypes('GET_GAME');

export const getCategories = createAsyncAction(GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL)<
  IGetCategoriesReqType,
  IResType,
  AxiosError
>();

export const getGame = createAsyncAction(GET_GAME, GET_GAME_SUCCESS, GET_GAME_FAIL)<
  IGetGameReqType,
  IResType,
  AxiosError
>();
