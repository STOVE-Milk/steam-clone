import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import { getGiftCardListAPI, doChargeAPI, doApprovalChargeAPI } from 'pages/api/user/api';
import {
  getGiftCardList,
  GET_GIFTCARDLIST,
  doCharge,
  DO_CHARGE,
  doApprovalCharge,
  DO_APPROVAL_CHARGE,
} from 'modules/user/actions';

const getCategoriesSaga = createAsyncSaga(getGiftCardList, getGiftCardListAPI);
const doChargeSaga = createAsyncSaga(doCharge, doChargeAPI);
const doApprovalChargeSaga = createAsyncSaga(doApprovalCharge, doApprovalChargeAPI);

export function* userSaga() {
  yield takeLatest(GET_GIFTCARDLIST, getCategoriesSaga);
  yield takeLatest(DO_CHARGE, doChargeSaga);
  yield takeLatest(DO_APPROVAL_CHARGE, doApprovalChargeSaga);
}

export { userSaga as default };
