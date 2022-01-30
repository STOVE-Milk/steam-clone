import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import { IResType } from 'pages/api/game/type';
import {
  getCategoriesAPI,
  getGameAPI,
  getGamesByCategoryAPI,
  getWishListAPI,
  getUserDataAPI,
} from 'pages/api/game/api';
import {
  getCategories,
  GET_CATEGORIES,
  getGame,
  GET_GAME,
  getGamesByCategory,
  GET_GAMESBYCATEGORY,
  getWishList,
  GET_WISHLIST,
  getUserData,
  GET_USERDATA,
} from 'modules/game/actions';

const getCategoriesSaga = createAsyncSaga(getCategories, getCategoriesAPI);
const getGameSaga = createAsyncSaga(getGame, getGameAPI);
const getGamesByCategorySaga = createAsyncSaga(getGamesByCategory, getGamesByCategoryAPI);
const getWishListSaga = createAsyncSaga(getWishList, getWishListAPI);
const getUserDataSaga = createAsyncSaga(getUserData, getUserDataAPI);

export function* gameSaga() {
  yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
  yield takeLatest(GET_GAME, getGameSaga);
  yield takeLatest(GET_GAMESBYCATEGORY, getGamesByCategorySaga);
  yield takeLatest(GET_WISHLIST, getWishListSaga);
  yield takeLatest(GET_USERDATA, getUserDataSaga);
}

export { gameSaga as default };
