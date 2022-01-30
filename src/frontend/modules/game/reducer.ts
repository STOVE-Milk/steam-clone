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
  GET_WISHLISTDATA,
  GET_WISHLISTDATA_SUCCESS,
  GET_WISHLISTDATA_FAIL,
  GET_WISHLIST,
  GET_WISHLIST_SUCCESS,
  GET_WISHLIST_FAIL,
  GET_USERDATA,
  GET_USERDATA_SUCCESS,
  GET_USERDATA_FAIL,
} from './actions';
import {
  initalCategory,
  initalGamesByCategory,
  initalGame,
  initialWishlist,
  initialUserData,
  initialWishlistData,
} from './initalData';

const initialState: gameState = {
  categories: asyncState.initial(initalCategory),
  gamesByCategory: asyncState.initial(initalGamesByCategory),
  game: asyncState.initial(initalGame),
  wishListData: asyncState.initial(initialWishlistData),
  wishList: asyncState.initial(initialWishlist), //임시로 inital data 넣어놓음
  userData: asyncState.initial(initialUserData),
};

const reducer = createReducer<gameState>(initialState, {
  [GET_CATEGORIES]: (state, action) => ({
    ...state,
    categories: asyncState.load(initalCategory),
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
    game: asyncState.load(initalGame),
  }),
  [GET_GAME_SUCCESS]: (state, action) => ({
    ...state,
    game: asyncState.success(action.payload.data.game),
  }),
  [GET_GAME_FAIL]: (state, action) => ({
    ...state,
    game: asyncState.error(initalGame, action.payload),
  }),
  [GET_GAMESBYCATEGORY]: (state, action) => ({
    ...state,
    gamesByCategory: asyncState.load(initalGamesByCategory),
  }),
  [GET_GAMESBYCATEGORY_SUCCESS]: (state, action) => ({
    ...state,
    gamesByCategory: asyncState.success(action.payload.data.game_list),
  }),
  [GET_GAMESBYCATEGORY_FAIL]: (state, action) => ({
    ...state,
    gamesByCategory: asyncState.error(initalGamesByCategory, action.payload),
  }),
  [GET_WISHLISTDATA]: (state, action) => ({
    ...state,
    wishListData: asyncState.load(initialWishlistData),
  }),
  [GET_WISHLISTDATA_SUCCESS]: (state, action) => ({
    ...state,
    wishListData: asyncState.success(action.payload.data.game_list),
  }),
  [GET_WISHLISTDATA_FAIL]: (state, action) => ({
    ...state,
    wishListData: asyncState.error(initialWishlistData, action.payload),
  }),
  [GET_WISHLIST]: (state, action) => ({
    ...state,
    wishList: asyncState.load(initialWishlist),
  }),
  [GET_WISHLIST_SUCCESS]: (state, action) => ({
    ...state,
    wishList: asyncState.success(action.payload.data.game_list),
  }),
  [GET_WISHLIST_FAIL]: (state, action) => ({
    ...state,
    wishList: asyncState.error(initialWishlist, action.payload),
  }),
  [GET_USERDATA]: (state, action) => ({
    ...state,
    userData: asyncState.load(initialUserData),
  }),
  [GET_USERDATA_SUCCESS]: (state, action) => ({
    ...state,
    userData: asyncState.success(action.payload.data.game_list),
  }),
  [GET_USERDATA_FAIL]: (state, action) => ({
    ...state,
    userData: asyncState.error(initialUserData, action.payload),
  }),
});

export default reducer;
