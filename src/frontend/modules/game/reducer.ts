import { createReducer } from 'typesafe-actions';

import { gameAction, gameState } from './types';
import { GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL } from './actions';

const initialState: gameState = {
  categories: [],
  categoryError: '',
};

const reducer = createReducer<gameState>(initialState, {
  [GET_CATEGORIES_SUCCESS]: (state, action) => ({
    ...state,
    categories: action.payload,
  }),
  [GET_CATEGORIES_FAIL]: (state, action) => ({
    ...state,
    categoryError: 'a',
  }),
});

export default reducer;
