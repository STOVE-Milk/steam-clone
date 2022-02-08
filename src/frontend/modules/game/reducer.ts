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
  ADD_CARTINFO,
  ADD_CARTINFO_SUCCESS,
  ADD_CARTINFO_FAIL,
  RM_CARTINFO,
  RM_CARTINFO_SUCCESS,
  RM_CARTINFO_FAIL,
  GET_GAMEINFOBYIDLIST,
  GET_GAMEINFOBYIDLIST_SUCCESS,
  GET_GAMEINFOBYIDLIST_FAIL,
} from './actions';
import { initalCategory, initalGamesByCategory, initalGame, initalCartInfo, initalGamesByIdList } from './initalData';

const initialState: gameState = {
  categories: asyncState.initial(initalCategory),
  gamesByCategory: asyncState.initial(initalGamesByCategory),
  game: asyncState.initial(initalGame),
  cartInfo: asyncState.initial(initalCartInfo),
  gamesByIdList: asyncState.initial(initalGamesByIdList),
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
    gamesByCategory: asyncState.error(initalGamesByCategory, action.payload.data.game_list),
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
