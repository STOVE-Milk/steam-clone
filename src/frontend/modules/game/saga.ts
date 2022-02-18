import { takeLatest, call, put } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';
import { getUserDataAPI } from 'api/game/api';

import { getUserData, GET_USERDATA, addGameOffset, ADD_GAMEOFFSET } from 'modules/game/actions';
import { addGameOffsetToStore } from 'modules/game/sagaFunction';

const getUserDataSaga = createAsyncSaga(getUserData, getUserDataAPI);
const addGameOffsetSaga = createAsyncSaga(addGameOffset, addGameOffsetToStore);

export function* gameSaga() {
  yield takeLatest(GET_USERDATA, getUserDataSaga);
  yield takeLatest(ADD_GAMEOFFSET, addGameOffsetSaga);
}

export { gameSaga as default };
