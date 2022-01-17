import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from '../createRequestSaga';

import { IGetCategoriesReqType, IGetCategoriesResType } from 'pages/api/game/type';

export const [GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL] = createRequestActionTypes('GET_CATEGORIES');

export const getCategories = createAsyncAction(GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL)<
  IGetCategoriesReqType,
  IGetCategoriesResType,
  AxiosError
>();
// action의 parameter들을 <>에 넣어줌
// export const setStringArr = createAction(SET_STRING_ARR)<string[]>();
// export const setObject = createAction(SET_OBJECT)<{
//   a: string[];
//   b: number;
//   c: string;
// }>();
