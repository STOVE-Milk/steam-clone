import { takeLatest, call, put } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';
import { addCartInfo, ADD_CARTINFO, rmCartInfo, RM_CARTINFO } from 'modules/cart/actions';
import { addCartToStore, rmCartToStore } from 'modules/cart/sagaFunction';

const addCartInfoSaga = createAsyncSaga(addCartInfo, addCartToStore);
const rmCartInfoSaga = createAsyncSaga(rmCartInfo, rmCartToStore);

export function* cartSaga() {
  yield takeLatest(ADD_CARTINFO, addCartInfoSaga);
  yield takeLatest(RM_CARTINFO, rmCartInfoSaga);
}

export { cartSaga as default };
