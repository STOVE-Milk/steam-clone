import { call, put, takeLatest } from 'redux-saga/effects';

import { getCategoriesAPI } from '../../pages/api/game/api';
import { IGetCategoriesResType } from '../../pages/api/game/type';
import { getCategories, GET_CATEGORIES } from 'modules/game/actions';
import axios from 'axios';

function* getCategoriesSaga(action: ReturnType<typeof getCategories.request>) {
  try {
    const response: IGetCategoriesResType = yield call(getCategoriesAPI, action.payload);

    yield put(getCategories.success(response));
  } catch (e: any) {
    yield put(getCategories.failure(e));
  }
}

export function* gameSaga() {
  yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
}

export { gameSaga as default };
