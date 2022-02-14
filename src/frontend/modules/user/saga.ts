import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import { saveUserInfo, SAVE_USERINFO } from 'modules/user/actions';
import { saveUserInfoToStore } from 'modules/user/sagaFunction';

const saveUserInfoSaga = createAsyncSaga(saveUserInfo, saveUserInfoToStore);

export function* userSaga() {
  yield takeLatest(SAVE_USERINFO, saveUserInfoSaga);
}

export { userSaga as default };
