import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';
import { getCategoriesAPI, getGameAPI, getGamesByCategoryAPI, getGameInfoByIdListAPI } from 'pages/api/game/api';
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
  getGameInfoByIdList,
  GET_GAMEINFOBYIDLIST,
} from 'modules/game/actions';
import { addCartToStore, rmCartToStore } from 'modules/game/sagaFunction';

const getCategoriesSaga = createAsyncSaga(getCategories, getCategoriesAPI);
const getGameSaga = createAsyncSaga(getGame, getGameAPI);
const getGamesByCategorySaga = createAsyncSaga(getGamesByCategory, getGamesByCategoryAPI);
const addCartInfoSaga = createAsyncSaga(addCartInfo, addCartToStore);
const rmCartInfoSaga = createAsyncSaga(rmCartInfo, rmCartToStore);
const getGameInfoByIdListSaga = createAsyncSaga(getGameInfoByIdList, getGameInfoByIdListAPI);

export function* gameSaga() {
  yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
  yield takeLatest(GET_GAME, getGameSaga);
  yield takeLatest(GET_GAMESBYCATEGORY, getGamesByCategorySaga);
  yield takeLatest(ADD_CARTINFO, addCartInfoSaga);
  yield takeLatest(RM_CARTINFO, rmCartInfoSaga);
  yield takeLatest(GET_GAMEINFOBYIDLIST, getGameInfoByIdListSaga);
}

export { gameSaga as default };
