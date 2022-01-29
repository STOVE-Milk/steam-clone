import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { gameState } from './types';
import {
  GET_CATEGORIES,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
  GET_GAME,
  GET_GAME_SUCCESS,
  GET_GAME_FAIL,
  GET_GAMESBYCATEGORY,
  GET_GAMESBYCATEGORY_SUCCESS,
  GET_GAMESBYCATEGORY_FAIL,
  GET_WISHLIST,
  GET_WISHLIST_SUCCESS,
  GET_WISHLIST_FAIL,
} from './actions';
import { initalCategory, initalGamesByCategory, initalGame, initialWishlist } from './initalData';

const initialState: gameState = {
  categories: asyncState.initial(initalCategory),
  gamesByCategory: asyncState.initial(initalGamesByCategory),
  game: asyncState.initial(initalGame),
  wishList: asyncState.initial(initialWishlist), //임시로 inital data 넣어놓음
};

const reducer = createReducer<gameState>(initialState, {
  [GET_CATEGORIES]: (state, action) => ({
    ...state,
    categories: asyncState.load(action.payload),
  }),
  [GET_CATEGORIES_SUCCESS]: (state, action) => ({
    ...state,
    categories: asyncState.success(action.payload.data.category_list),
  }),
  [GET_CATEGORIES_FAIL]: (state, action) => ({
    ...state,
    categories: asyncState.error(initalCategory, action.payload),
  }),
  [GET_GAME]: (state, action) => ({
    ...state,
    game: asyncState.load(action.payload),
  }),
  [GET_GAME_SUCCESS]: (state, action) => ({
    ...state,
    game: asyncState.success(action.payload),
  }),
  [GET_GAME_FAIL]: (state, action) => ({
    ...state,
    game: asyncState.error(initalGame, action.payload),
  }),
  [GET_GAMESBYCATEGORY]: (state, action) => ({
    ...state,
    gamesByCategory: asyncState.load(action.payload),
  }),
  [GET_GAMESBYCATEGORY_SUCCESS]: (state, action) => ({
    ...state,
    gamesByCategory: asyncState.success(action.payload.data.game_list),
  }),
  [GET_GAMESBYCATEGORY_FAIL]: (state, action) => ({
    ...state,
    gamesByCategory: asyncState.error(initalGamesByCategory, action.payload),
  }),
  [GET_WISHLIST]: (state, action) => ({
    ...state,
    wishList: asyncState.load(action.payload),
  }),
  [GET_WISHLIST_SUCCESS]: (state, action) => ({
    ...state,
    wishList: asyncState.success(action.payload.data.game_list),
  }),
  [GET_WISHLIST_FAIL]: (state, action) => ({
    ...state,
    wishList: asyncState.error(initialWishlist, action.payload),
  }),
});

export default reducer;
