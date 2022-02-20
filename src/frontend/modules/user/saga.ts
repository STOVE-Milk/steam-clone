import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import { saveUserInfo, SAVE_USERINFO } from 'modules/user/actions';
import { saveUserInfoToStore } from 'modules/user/sagaFunction';
import { getFriend, GET_FRIEND } from 'modules/user/actions';

import { getFriendsAPI } from 'api/friend/api';

const saveUserInfoSaga = createAsyncSaga(saveUserInfo, saveUserInfoToStore);
const getFriendSaga = createAsyncSaga(getFriend, getFriendsAPI);

export function* userSaga() {
  yield takeLatest(SAVE_USERINFO, saveUserInfoSaga);
  yield takeLatest(GET_FRIEND, getFriendSaga);
}

export { userSaga as default };
