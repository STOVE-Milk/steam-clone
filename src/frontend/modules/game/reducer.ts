import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { gameState } from './types';
import {
  GET_CATEGORIES,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAIL,
  GET_GAMESBYCATEGORY,
  GET_GAMESBYCATEGORY_SUCCESS,
  GET_GAMESBYCATEGORY_FAIL,
  ADD_CARTINFO,
  ADD_CARTINFO_SUCCESS,
  ADD_CARTINFO_FAIL,
  RM_CARTINFO,
  RM_CARTINFO_SUCCESS,
  RM_CARTINFO_FAIL,
  GET_GAMEINFOBYIDLIST,
  GET_GAMEINFOBYIDLIST_SUCCESS,
  GET_GAMEINFOBYIDLIST_FAIL,
  GET_WISHLIST,
  GET_WISHLIST_SUCCESS,
  GET_WISHLIST_FAIL,
  DO_WISH,
  DO_WISH_SUCCESS,
  DO_WISH_FAIL,
  GET_USERDATA,
  GET_USERDATA_SUCCESS,
  GET_USERDATA_FAIL,
  DO_UNWISH,
  DO_UNWISH_SUCCESS,
  DO_UNWISH_FAIL,
} from './actions';
import {
  initalCategory,
  initalGamesByCategory,
  initalCartInfo,
  initalGamesByIdList,
  initialWish,
  initialUserData,
  initialWishList,
  initialUnWish,
} from './initalData';

const initialState: gameState = {
  categories: asyncState.initial(initalCategory),
  cartInfo: asyncState.initial(initalCartInfo),
  gamesByIdList: asyncState.initial(initalGamesByIdList),
  wish: asyncState.initial(initialWish),
  unWish: asyncState.initial(initialUnWish),
  wishList: asyncState.initial(initialWishList), //임시로 inital data 넣어놓음
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
  [GET_WISHLIST]: (state, action) => ({
    ...state,
    wishList: asyncState.load(initialWishList),
  }),
  [GET_WISHLIST_SUCCESS]: (state, action) => ({
    ...state,
    wishList: asyncState.success(action.payload.data.game_list),
  }),
  [GET_WISHLIST_FAIL]: (state, action) => ({
    ...state,
    wishList: asyncState.error(initialWishList, action.payload),
  }),
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
  [GET_USERDATA]: (state, action) => ({
    ...state,
    userData: asyncState.load(initialUserData),
  }),
  [GET_USERDATA_SUCCESS]: (state, action) => ({
    ...state,
    userData: asyncState.success(action.payload.data),
  }),
  [GET_USERDATA_FAIL]: (state, action) => ({
    ...state,
    userData: asyncState.error(initialUserData, action.payload),
  }),
  [ADD_CARTINFO]: (state, action) => ({
    ...state,
    cartInfo: asyncState.load(initalCartInfo),
  }),
  [ADD_CARTINFO_SUCCESS]: (state, action) => ({
    ...state,
    cartInfo: asyncState.success(action.payload.data),
  }),
  [ADD_CARTINFO_FAIL]: (state, action) => ({
    ...state,
    cartInfo: asyncState.error(initalCartInfo, action.payload.data),
  }),
  [RM_CARTINFO]: (state, action) => ({
    ...state,
    cartInfo: asyncState.load(initalCartInfo),
  }),
  [RM_CARTINFO_SUCCESS]: (state, action) => ({
    ...state,
    cartInfo: asyncState.success(action.payload.data),
  }),
  [RM_CARTINFO_FAIL]: (state, action) => ({
    ...state,
    cartInfo: asyncState.error(initalCartInfo, action.payload.data),
  }),
  [GET_GAMEINFOBYIDLIST]: (state, action) => ({
    ...state,
    gamesByIdList: asyncState.load(initalGamesByIdList),
  }),
  [GET_GAMEINFOBYIDLIST_SUCCESS]: (state, action) => ({
    ...state,
    gamesByIdList: asyncState.success(action.payload.data.game_list),
  }),
  [GET_GAMEINFOBYIDLIST_FAIL]: (state, action) => ({
    ...state,
    gamesByIdList: asyncState.error(initalGamesByIdList, action.payload.data.game_list),
  }),
});

export default reducer;
