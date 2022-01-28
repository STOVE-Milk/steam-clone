import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import { getGiftCardListAPI, doChargeAPI } from 'pages/api/user/api';
import { getGiftCardList, GET_GIFTCARDLIST, doCharge, DO_CHARGE } from 'modules/user/actions';

const getCategoriesSaga = createAsyncSaga(getGiftCardList, getGiftCardListAPI);
const doChargeSaga = createAsyncSaga(doCharge, doChargeAPI);

export function* userSaga() {
  yield takeLatest(GET_GIFTCARDLIST, getCategoriesSaga);
  yield takeLatest(DO_CHARGE, doChargeSaga);
}

export { userSaga as default };
