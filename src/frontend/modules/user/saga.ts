import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import { doSignupAPI } from '../../pages/api/user/api';
import { doSignup, DO_SIGNUP } from 'modules/user/actions';

const doSignupSaga = createAsyncSaga(doSignup, doSignupAPI);

export function* userSaga() {
  yield takeLatest(DO_SIGNUP, doSignupSaga);
}

export { userSaga as default };
