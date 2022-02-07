import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';
import { getCategoriesAPI, getGameAPI, getGamesByCategoryAPI } from 'pages/api/game/api';
import {
  getCategories,
  GET_CATEGORIES,
  getGame,
  GET_GAME,
  getGamesByCategory,
  GET_GAMESBYCATEGORY,
  addCartInfo,
  ADD_CARTINFO,
  rmCartInfo,
  RM_CARTINFO,
} from 'modules/game/actions';
import { addCartToStore, rmCartToStore } from 'modules/game/sagaFunction';

const getCategoriesSaga = createAsyncSaga(getCategories, getCategoriesAPI);
const getGameSaga = createAsyncSaga(getGame, getGameAPI);
const getGamesByCategorySaga = createAsyncSaga(getGamesByCategory, getGamesByCategoryAPI);
const addCartInfoSaga = createAsyncSaga(addCartInfo, addCartToStore);
const rmCartInfoSaga = createAsyncSaga(addCartInfo, rmCartToStore);

export function* gameSaga() {
  yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
  yield takeLatest(GET_GAME, getGameSaga);
  yield takeLatest(GET_GAMESBYCATEGORY, getGamesByCategorySaga);
  yield takeLatest(ADD_CARTINFO, addCartInfoSaga);
  yield takeLatest(RM_CARTINFO, rmCartInfoSaga);
}

export { gameSaga as default };
