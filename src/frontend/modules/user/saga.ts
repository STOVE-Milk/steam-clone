import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import { doSignupAPI } from '../../pages/api/user/api';
import { doSignup, DO_SIGNUP, saveUserInfo, SAVE_USERINFO } from 'modules/user/actions';
import { saveUserInfoToStore } from 'modules/user/sagaFunction';

const doSignupSaga = createAsyncSaga(doSignup, doSignupAPI);
const saveUserInfoSaga = createAsyncSaga(saveUserInfo, saveUserInfoToStore);

export function* userSaga() {
  yield takeLatest(DO_SIGNUP, doSignupSaga);
  yield takeLatest(SAVE_USERINFO, saveUserInfoSaga);
}

export { userSaga as default };
