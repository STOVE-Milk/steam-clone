import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';

import { IGetCategoriesReqType, IGetGameReqType, IGetGamesByCategoryReqType, IResType } from 'pages/api/game/type';

export const [GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL] = createRequestActionTypes('GET_CATEGORIES');
export const [GET_GAME, GET_GAME_SUCCESS, GET_GAME_FAIL] = createRequestActionTypes('GET_GAME');
export const [GET_GAMESBYCATEGORY, GET_GAMESBYCATEGORY_SUCCESS, GET_GAMESBYCATEGORY_FAIL] =
  createRequestActionTypes('GET_GAMESBYCATEGORY');

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
export const getGamesByCategory = createAsyncAction(
  GET_GAMESBYCATEGORY,
  GET_GAMESBYCATEGORY_SUCCESS,
  GET_GAMESBYCATEGORY_FAIL,
)<IGetGamesByCategoryReqType, IResType, AxiosError>();
