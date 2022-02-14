import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import { doSignupAPI } from 'api/auth/api';
import { doSignup, DO_SIGNUP } from 'modules/auth/actions';

const doSignupSaga = createAsyncSaga(doSignup, doSignupAPI);

export function* authSaga() {
  yield takeLatest(DO_SIGNUP, doSignupSaga);
}

export { authSaga as default };
