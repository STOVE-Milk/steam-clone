import { createReducer } from 'typesafe-actions';

import { gameAction, gameState } from './types';
import {
  GET_CATEGORIES,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
  GET_GAMESBYCATEGORY_SUCCESS,
  GET_GAMESBYCATEGORY_FAIL,
} from './actions';

const initialState: gameState = {
  categories: [
    'Sandbox',
    'Real-time strategy (RTS)',
    'Shooters (FPS and TPS)',
    'Multiplayer online battle arena (MOBA)',
    'Role-playing (RPG, ARPG, and More)',
    'Simulation and sports.',
    'Puzzlers and party games.',
    'Action-adventure.',
  ],
  categoryError: '',
  gameSimpleList: [],
  gameSimpleListError: '',
};

const reducer = createReducer<gameState>(initialState, {
  [GET_CATEGORIES_SUCCESS]: (state, action) => ({
    ...state,
    categories: action.payload.data.category_list,
  }),
  [GET_CATEGORIES_FAIL]: (state, action) => ({
    ...state,
    categoryError: '',
  }),
  [GET_GAMESBYCATEGORY_SUCCESS]: (state, action) => ({
    ...state,
    gameSimpleList: action.payload.data.get_simple_list,
  }),
  [GET_GAMESBYCATEGORY_FAIL]: (state, action) => ({
    ...state,
    gameSimpleListError: '',
  }),
});

export default reducer;
