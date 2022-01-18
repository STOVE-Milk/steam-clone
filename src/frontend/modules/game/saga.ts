import { call, put, takeLatest } from 'redux-saga/effects';

import { getCategoriesAPI } from '../../pages/api/game/api';
import { IResType } from '../../pages/api/game/type';
import { getCategories, GET_CATEGORIES, getGame, GET_GAME } from 'modules/game/actions';

function* getCategoriesSaga(action: ReturnType<typeof getCategories.request>) {
  try {
    const response: IResType = yield call(getCategoriesAPI, action.payload);

    yield put(getCategories.success(response));
  } catch (e: any) {
    yield put(getCategories.failure(e));
  }
}

function* getGameSaga(action: ReturnType<typeof getGame.request>) {
  try {
    const response: IResType = yield call(getCategoriesAPI, action.payload);

    yield put(getGame.success(response));
  } catch (e: any) {
    yield put(getGame.failure(e));
  }
}

export function* gameSaga() {
  yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
  yield takeLatest(GET_GAME, getGameSaga);
}

export { gameSaga as default };
