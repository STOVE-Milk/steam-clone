import { AnyAction, CombinedState, combineReducers } from 'redux';
import { all, fork } from 'redux-saga/effects';
import { HYDRATE } from 'next-redux-wrapper';

import game, { gameSaga, gameState } from './game';
import user, { userSaga, IUserState } from './user';
import cart, { cartSaga, ICartState } from './cart';
import wishlist, { wishSaga, IWishState } from './wishlist';
import auth, { authSaga, IAuthState } from './auth';

export interface IState {
  game: gameState;
  user: IUserState;
  cart: ICartState;
  wishlist: IWishState;
  auth: IAuthState;
}

export const rootReducer = (state: IState, action: AnyAction): CombinedState<IState> => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combinedReducers = combineReducers({
        game: game,
        user: user,
        cart: cart,
        wishlist: wishlist,
        auth: auth,
      });
      return combinedReducers(state, action);
    }
  }
};

export default rootReducer;

export function* rootSaga() {
  yield all([gameSaga(), userSaga(), cartSaga(), wishSaga(), authSaga()]);
}
