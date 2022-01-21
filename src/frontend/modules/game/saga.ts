import { call, put, takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import { IResType } from 'pages/api/game/type';
import { getCategoriesAPI, getGameAPI } from '../../pages/api/game/api';
import { getCategories, GET_CATEGORIES, getGame, GET_GAME } from 'modules/game/actions';
import { resolve } from 'path/posix';

const getCategoriesSaga = createAsyncSaga(getCategories, getCategoriesAPI);
const getGameSaga = createAsyncSaga(getGame, getGameAPI);

export function* gameSaga() {
  yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
  yield takeLatest(GET_GAME, getGameSaga);
}

export { gameSaga as default };
