import { AnyAction, CombinedState, combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import { HYDRATE } from 'next-redux-wrapper';

import game, { gameSaga, gameState } from './game';

export interface IState {
  game: gameState;
}

export const rootReducer = (state: IState, action: AnyAction): CombinedState<IState> => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combinedReducers = combineReducers({
        game: game,
      });
      return combinedReducers(state, action);
    }
  }
};

export default rootReducer;

export function* rootSaga() {
  yield all([gameSaga()]);
}
