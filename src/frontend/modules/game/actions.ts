import { createAsyncAction, createAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from '../createRequestSaga';

import { IGetCategoriesReqType, IGetGameReqType, IResType } from 'pages/api/game/type';

// export const [GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL] = createRequestActionTypes('GET_CATEGORIES');
export const GET_CATEGORIES = 'GET_CATEGORIES';
export const GET_CATEGORIES_SUCCESS = 'GET_CATEGORIES_SUCCESS';
export const GET_CATEGORIES_FAIL = 'GET_CATEGORIES_FAIL';

export const GET_GAME = 'GET_GAME';
export const GET_GAME_SUCCESS = 'GET_GAME_SUCCESS';
export const GET_GAME_FAIL = 'GET_GAME_FAIL';

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

// action의 parameter들을 <>에 넣어줌
// export const setStringArr = createAction(SET_STRING_ARR)<string[]>();
// export const setObject = createAction(SET_OBJECT)<{
//   a: string[];
//   b: number;
//   c: string;
// }>();
