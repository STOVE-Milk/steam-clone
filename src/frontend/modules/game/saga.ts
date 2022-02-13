import { takeLatest, call, put } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';
import { getCategoriesAPI, getGamesByCategoryAPI, getUserDataAPI } from 'api/game/api';
import { doWishAPI, doUnWishAPI, getWishListAPI } from 'api/wishlist/api';
import {
  addCartInfo,
  ADD_CARTINFO,
  rmCartInfo,
  RM_CARTINFO,
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

const addCartInfoSaga = createAsyncSaga(addCartInfo, addCartToStore);
const rmCartInfoSaga = createAsyncSaga(rmCartInfo, rmCartToStore);
const getWishListSaga = createAsyncSaga(getWishList, getWishListAPI);
const doWishSaga = createAsyncSaga(doWish, doWishAPI);
const doUnWishSaga = createAsyncSaga(doUnWish, doUnWishAPI);
const getUserDataSaga = createAsyncSaga(getUserData, getUserDataAPI);

export function* gameSaga() {
  yield takeLatest(ADD_CARTINFO, addCartInfoSaga);
  yield takeLatest(RM_CARTINFO, rmCartInfoSaga);
  yield takeLatest(GET_WISHLIST, getWishListSaga);
  yield takeLatest(DO_WISH, doWishSaga);
  yield takeLatest(DO_UNWISH, doUnWishSaga);
  yield takeLatest(GET_USERDATA, getUserDataSaga);
}

export { gameSaga as default };
