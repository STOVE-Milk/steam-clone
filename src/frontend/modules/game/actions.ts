import { createAction } from 'typesafe-actions';

import { createRequestActionTypes } from '../createRequestSaga';

export const [GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL] = createRequestActionTypes('GET_CATEGORIES');

export const getCategories = createAction(GET_CATEGORIES)();
// action의 parameter들을 <>에 넣어줌
// export const setStringArr = createAction(SET_STRING_ARR)<string[]>();
// export const setObject = createAction(SET_OBJECT)<{
//   a: string[];
//   b: number;
//   c: string;
// }>();
