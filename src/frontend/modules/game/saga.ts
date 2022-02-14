import { takeLatest, call, put } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';
import { getUserDataAPI } from 'api/game/api';

import { getUserData, GET_USERDATA } from 'modules/game/actions';

const getUserDataSaga = createAsyncSaga(getUserData, getUserDataAPI);

export function* gameSaga() {
  yield takeLatest(GET_USERDATA, getUserDataSaga);
}

export { gameSaga as default };
