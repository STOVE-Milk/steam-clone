import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { gameState } from './types';
import {
  GET_USERDATA,
  GET_USERDATA_SUCCESS,
  GET_USERDATA_FAIL,
  GET_SEARCHRESULT,
  GET_SEARCHRESULT_SUCCESS,
  GET_SEARCHRESULT_FAIL,
} from './actions';
import { initialUserData } from './initalData';

const initialState: gameState = {
  userData: asyncState.initial(initialUserData),
  searchData: asyncState.initial([]),
};

const reducer = createReducer<gameState>(initialState, {
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
  [GET_SEARCHRESULT]: (state, action) => ({
    ...state,
    searchData: asyncState.load([]),
  }),
  [GET_SEARCHRESULT_SUCCESS]: (state, action) => ({
    ...state,
    searchData: asyncState.success(action.payload.data.game_list),
  }),
  [GET_SEARCHRESULT_FAIL]: (state, action) => ({
    ...state,
    searchData: asyncState.error([], action.payload),
  }),
});

export default reducer;
