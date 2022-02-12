import { call, put, takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import {
  getCategoriesAPI,
  getGameAPI,
  getGamesByCategoryAPI,
  getUserDataAPI,
  getGameInfoByIdListAPI,
} from 'api/game/api';
import { doWishAPI, doUnWishAPI, getWishListAPI } from 'api/wishlist/api';
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
  getWishList,
  GET_WISHLIST,
  doWish,
  DO_WISH,
  doUnWish,
  DO_UNWISH,
  getUserData,
  GET_USERDATA,
} from 'modules/game/actions';
import { addCartToStore, rmCartToStore } from 'modules/game/sagaFunction';

const getCategoriesSaga = createAsyncSaga(getCategories, getCategoriesAPI);
const getGameSaga = createAsyncSaga(getGame, getGameAPI);
const getGamesByCategorySaga = createAsyncSaga(getGamesByCategory, getGamesByCategoryAPI);
const addCartInfoSaga = createAsyncSaga(addCartInfo, addCartToStore);
const rmCartInfoSaga = createAsyncSaga(rmCartInfo, rmCartToStore);
const getGameInfoByIdListSaga = createAsyncSaga(getGameInfoByIdList, getGameInfoByIdListAPI);
const getWishListSaga = createAsyncSaga(getWishList, getWishListAPI);
const doWishSaga = createAsyncSaga(doWish, doWishAPI);
const doUnWishSaga = createAsyncSaga(doUnWish, doUnWishAPI);
const getUserDataSaga = createAsyncSaga(getUserData, getUserDataAPI);

export function* gameSaga() {
  yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
  yield takeLatest(GET_GAME, getGameSaga);
  yield takeLatest(GET_GAMESBYCATEGORY, getGamesByCategorySaga);
  yield takeLatest(ADD_CARTINFO, addCartInfoSaga);
  yield takeLatest(RM_CARTINFO, rmCartInfoSaga);
  yield takeLatest(GET_GAMEINFOBYIDLIST, getGameInfoByIdListSaga);
  yield takeLatest(GET_WISHLIST, getWishListSaga);
  yield takeLatest(DO_WISH, doWishSaga);
  yield takeLatest(DO_UNWISH, doUnWishSaga);
  yield takeLatest(GET_USERDATA, getUserDataSaga);
}

export { gameSaga as default };
