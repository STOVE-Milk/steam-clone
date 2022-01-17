import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import game, { gameSaga } from './game';

const rootReducer = combineReducers({
  game,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([gameSaga()]);
}
