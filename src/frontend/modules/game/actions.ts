import { createAsyncAction, createAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from '../createRequestSaga';

import {
  IGetCategoriesReqType,
  IGetCategoriesResType,
  IGetGamesByCategoryReqType,
  IGetGamesByCategoryResType,
} from 'pages/api/game/type';

// export const [GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL] = createRequestActionTypes('GET_CATEGORIES');
export const GET_CATEGORIES = 'GET_CATEGORIES';
export const GET_CATEGORIES_SUCCESS = 'GET_CATEGORIES_SUCCESS';
export const GET_CATEGORIES_FAIL = 'GET_CATEGORIES_FAIL';

export const getCategories = createAsyncAction(GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL)<
  IGetCategoriesReqType,
  IGetCategoriesResType,
  AxiosError
>();

export const GET_GAMESBYCATEGORY = 'GET_GAMESBYCATEGORY';
export const GET_GAMESBYCATEGORY_SUCCESS = 'GET_GAMESBYCATEGORY_SUCCESS';
export const GET_GAMESBYCATEGORY_FAIL = 'GET_GAMESBYCATEGORY_FAIL';

export const getGamesByCategory = createAsyncAction(
  GET_GAMESBYCATEGORY,
  GET_GAMESBYCATEGORY_SUCCESS,
  GET_GAMESBYCATEGORY_FAIL,
)<IGetGamesByCategoryReqType, IGetGamesByCategoryResType, AxiosError>();

// action의 parameter들을 <>에 넣어줌
// export const setStringArr = createAction(SET_STRING_ARR)<string[]>();
// export const setObject = createAction(SET_OBJECT)<{
//   a: string[];
//   b: number;
//   c: string;
// }>();
