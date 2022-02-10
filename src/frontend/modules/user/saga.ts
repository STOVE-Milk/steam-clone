import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';
import { saveUserInfoToStore } from 'modules/user/sagaFunction';
import { getGiftCardListAPI, doChargeAPI, doApprovalChargeAPI, doSignupAPI } from 'pages/api/user/api';
import {
  getGiftCardList,
  GET_GIFTCARDLIST,
  doCharge,
  DO_CHARGE,
  doApprovalCharge,
  DO_APPROVAL_CHARGE,
  doSignup,
  DO_SIGNUP,
  saveUserInfo,
  SAVE_USERINFO,
} from 'modules/user/actions';

const getCategoriesSaga = createAsyncSaga(getGiftCardList, getGiftCardListAPI);
const doChargeSaga = createAsyncSaga(doCharge, doChargeAPI);
const doApprovalChargeSaga = createAsyncSaga(doApprovalCharge, doApprovalChargeAPI);
const doSignupSaga = createAsyncSaga(doSignup, doSignupAPI);
const saveUserInfoSaga = createAsyncSaga(saveUserInfo, saveUserInfoToStore);

export function* userSaga() {
  yield takeLatest(GET_GIFTCARDLIST, getCategoriesSaga);
  yield takeLatest(DO_CHARGE, doChargeSaga);
  yield takeLatest(DO_APPROVAL_CHARGE, doApprovalChargeSaga);
  yield takeLatest(DO_SIGNUP, doSignupSaga);
  yield takeLatest(SAVE_USERINFO, saveUserInfoSaga);
}

export { userSaga as default };
