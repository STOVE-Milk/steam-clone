import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { IWishState } from './types';
import { DO_WISH, DO_WISH_SUCCESS, DO_WISH_FAIL, DO_UNWISH, DO_UNWISH_SUCCESS, DO_UNWISH_FAIL } from './actions';
import { initialWish, initialUnWish } from './initalData';

const initialState: IWishState = {
  wish: asyncState.initial(initialWish),
  unWish: asyncState.initial(initialUnWish),
};

const reducer = createReducer<IWishState>(initialState, {
  [DO_WISH]: (state, action) => ({
    ...state,
    wish: asyncState.load(initialWish),
  }),
  [DO_WISH_SUCCESS]: (state, action) => ({
    ...state,
    wish: asyncState.success(action.payload.data.success),
  }),
  [DO_WISH_FAIL]: (state, action) => ({
    ...state,
    wish: asyncState.error(initialWish, action.payload),
  }),
  [DO_UNWISH]: (state, action) => ({
    ...state,
    unWish: asyncState.load(initialUnWish),
  }),
  [DO_UNWISH_SUCCESS]: (state, action) => ({
    ...state,
    unWish: asyncState.success(action.payload.data.success),
  }),
  [DO_UNWISH_FAIL]: (state, action) => ({
    ...state,
    unWish: asyncState.error(initialUnWish, action.payload),
  }),
});

export default reducer;
