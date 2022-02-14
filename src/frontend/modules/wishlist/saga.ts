import { takeLatest, call, put } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';
import { doWishAPI, doUnWishAPI } from 'api/wishlist/api';
import { doWish, DO_WISH, doUnWish, DO_UNWISH } from 'modules/wishlist/actions';

const doWishSaga = createAsyncSaga(doWish, doWishAPI);
const doUnWishSaga = createAsyncSaga(doUnWish, doUnWishAPI);

export function* wishSaga() {
  yield takeLatest(DO_WISH, doWishSaga);
  yield takeLatest(DO_UNWISH, doUnWishSaga);
}

export { wishSaga as default };
