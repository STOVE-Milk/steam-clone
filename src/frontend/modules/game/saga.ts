import { takeLatest, call, put } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';
import { getUserDataAPI, getGameInfoByUserAPI } from 'api/game/api';

import {
  getUserData,
  GET_USERDATA,
  addGameOffset,
  ADD_GAMEOFFSET,
  getGameInfoByUser,
  ADD_GAMEINFOBYUSER,
} from 'modules/game/actions';
import { addGameOffsetToStore } from 'modules/game/sagaFunction';

const getUserDataSaga = createAsyncSaga(getUserData, getUserDataAPI);
const addGameOffsetSaga = createAsyncSaga(addGameOffset, addGameOffsetToStore);
const getGameInfoByUserSaga = createAsyncSaga(getGameInfoByUser, getGameInfoByUserAPI);

export function* gameSaga() {
  yield takeLatest(GET_USERDATA, getUserDataSaga);
  yield takeLatest(ADD_GAMEOFFSET, addGameOffsetSaga);
  yield takeLatest(ADD_GAMEINFOBYUSER, getGameInfoByUserSaga);
}

export { gameSaga as default };
