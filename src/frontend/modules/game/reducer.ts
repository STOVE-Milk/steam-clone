import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { gameState } from './types';
import {
  GET_USERDATA,
  GET_USERDATA_SUCCESS,
  GET_USERDATA_FAIL,
  ADD_GAMEOFFSET,
  ADD_GAMEOFFSET_SUCCESS,
  ADD_GAMEOFFSET_FAIL,
} from './actions';
import { initialUserData, initialGameOffset } from './initalData';

const initialState: gameState = {
  userData: asyncState.initial(initialUserData),
  gameOffsetData: asyncState.initial(initialGameOffset),
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
  [ADD_GAMEOFFSET]: (state, action) => ({
    ...state,
    gameOffsetData: asyncState.load(initialGameOffset),
  }),
  [ADD_GAMEOFFSET_SUCCESS]: (state, action) => ({
    ...state,
    gameOffsetData: asyncState.success(action.payload.data),
  }),
  [ADD_GAMEOFFSET_FAIL]: (state, action) => ({
    ...state,
    gameOffsetData: asyncState.error(initialUserData, action.payload),
  }),
});

export default reducer;
