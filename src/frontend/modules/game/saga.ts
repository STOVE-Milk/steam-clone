import { call, put, takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import { IResType } from 'pages/api/game/type';
import { getCategoriesAPI, getGameAPI, getGamesByCategoryAPI } from 'pages/api/game/api';
import {
  getCategories,
  GET_CATEGORIES,
  getGame,
  GET_GAME,
  getGamesByCategory,
  GET_GAMESBYCATEGORY,
} from 'modules/game/actions';

const getCategoriesSaga = createAsyncSaga(getCategories, getCategoriesAPI);
const getGameSaga = createAsyncSaga(getGame, getGameAPI);
const getGamesByCategorySaga = createAsyncSaga(getGamesByCategory, getGamesByCategoryAPI);

export function* gameSaga() {
  yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
  yield takeLatest(GET_GAME, getGameSaga);
  yield takeLatest(GET_GAMESBYCATEGORY, getGamesByCategorySaga);
}

export { gameSaga as default };
