import { takeLatest, call, put } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';
import { getUserDataAPI, getSearchContentAPI } from 'api/game/api';

import { getUserData, GET_USERDATA, getSearchData, GET_SEARCHRESULT } from 'modules/game/actions';

const getUserDataSaga = createAsyncSaga(getUserData, getUserDataAPI);

const getSearchDataSaga = createAsyncSaga(getSearchData, getSearchContentAPI);

export function* gameSaga() {
  yield takeLatest(GET_USERDATA, getUserDataSaga);
  yield takeLatest(GET_SEARCHRESULT, getSearchDataSaga);
}

export { gameSaga as default };
