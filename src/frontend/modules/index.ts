import { AnyAction, CombinedState, combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
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
// export const rootReducer = combineReducers({
//   game,
// });

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([gameSaga()]);
}
