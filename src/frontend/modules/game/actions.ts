import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';

import {
  IGetCategoriesReqType,
  IGetGameReqType,
  IGetGamesByCategoryReqType,
  IAddCartInfoReqType,
  IResType,
  IResStoreType,
  IRmCartInfoReqType,
} from 'pages/api/game/type';

export const [GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL] = createRequestActionTypes('GET_CATEGORIES');
export const [GET_GAME, GET_GAME_SUCCESS, GET_GAME_FAIL] = createRequestActionTypes('GET_GAME');
export const [GET_GAMESBYCATEGORY, GET_GAMESBYCATEGORY_SUCCESS, GET_GAMESBYCATEGORY_FAIL] =
  createRequestActionTypes('GET_GAMESBYCATEGORY');
export const [ADD_CARTINFO, ADD_CARTINFO_SUCCESS, ADD_CARTINFO_FAIL] = createRequestActionTypes('ADD_CARTINFO');
export const [RM_CARTINFO, RM_CARTINFO_SUCCESS, RM_CARTINFO_FAIL] = createRequestActionTypes('RM_CARTINFO');

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
