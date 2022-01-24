import { call, put, takeLatest } from 'redux-saga/effects';

import { getCategoriesAPI, getGamesByCategoryAPI } from '../../pages/api/game/api';
import { IGetCategoriesResType, IGetGamesByCategoryResType } from '../../pages/api/game/type';
import { getCategories, GET_CATEGORIES, getGamesByCategory, GET_GAMESBYCATEGORY } from 'modules/game/actions';
import axios from 'axios';

function* getCategoriesSaga(action: ReturnType<typeof getCategories.request>) {
  try {
    const response: IGetCategoriesResType = yield call(getCategoriesAPI, action.payload);

    yield put(getCategories.success(response));
  } catch (e: any) {
    yield put(getCategories.failure(e));
  }
}

function* getGamesByCategorySaga(action: ReturnType<typeof getGamesByCategory.request>) {
  try {
    const response: IGetGamesByCategoryResType = yield call(getGamesByCategoryAPI, action.payload);
    yield put(getGamesByCategory.success(response));
  } catch (e: any) {
    yield put(getGamesByCategory.failure(e));
  }
}

export function* gameSaga() {
  yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
  yield takeLatest(GET_GAMESBYCATEGORY, getGamesByCategorySaga);
}

export { gameSaga as default };
